import { DurableObject } from 'cloudflare:workers';
import type { IAllianceScore } from '@shared';

export type FieldStatus =
	| 'IDLE'
	| 'PRE_MATCH'
	| 'AUTONOMOUS'
	| 'TELEOP'
	| 'ENDGAME'
	| 'MATCH_FINISHED';

export interface FieldState {
	fieldId: string;
	matchId: string | null;
	status: FieldStatus;
	timer: number;
	liveScore: {
		red: IAllianceScore;
		blue: IAllianceScore;
		status: 'draft' | 'submitted' | 'finalized';
	};
	teams: {
		red: string[];
		blue: string[];
	};
}

interface StoredFieldState extends FieldState {
	running: boolean;
	deadlineMs: number | null;
}

interface RealtimeMessage {
	event: string;
	data?: unknown;
}

const STATE_KEY = 'field-state';
const MATCH_DURATION_SECONDS = 150;

function defaultScore(): IAllianceScore {
	return {
		teleIndependent: 0,
		sharedScore: 0,
		penalties: 0,
		endgame: 0,
		balanceMultiplier: 1,
		total: 0
	};
}

function defaultState(fieldId = ''): StoredFieldState {
	return {
		fieldId,
		matchId: null,
		status: 'IDLE',
		timer: 0,
		liveScore: { red: defaultScore(), blue: defaultScore(), status: 'draft' },
		teams: { red: [], blue: [] },
		running: false,
		deadlineMs: null
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isAlliance(value: unknown): value is 'red' | 'blue' {
	return value === 'red' || value === 'blue';
}

function isScoreUpdate(value: unknown): value is Partial<IAllianceScore> {
	if (!isRecord(value)) return false;

	const allowedKeys = new Set([
		'teleIndependent',
		'sharedScore',
		'penalties',
		'endgame',
		'balanceMultiplier',
		'total'
	]);

	return Object.entries(value).every(
		([key, score]) => allowedKeys.has(key) && typeof score === 'number' && Number.isFinite(score)
	);
}

function publicState(state: StoredFieldState): FieldState {
	const { running: _running, deadlineMs: _deadlineMs, ...visible } = state;
	return visible;
}

export class FieldRoom extends DurableObject<Env> {
	private state = defaultState();

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		ctx.blockConcurrencyWhile(async () => {
			this.state = (await ctx.storage.get<StoredFieldState>(STATE_KEY)) ?? defaultState();

			if (this.state.running && this.state.deadlineMs !== null) {
				await ctx.storage.setAlarm(Math.min(this.state.deadlineMs, Date.now() + 1_000));
			}
		});
	}

	async fetch(request: Request): Promise<Response> {
		if (request.method !== 'GET' || request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
			return Response.json({ error: 'WebSocket upgrade required' }, { status: 426 });
		}

		const fieldId = this.fieldIdFromRequest(request);
		if (!fieldId) {
			return Response.json({ error: 'Invalid field ID' }, { status: 400 });
		}

		if (this.state.fieldId && this.state.fieldId !== fieldId) {
			return Response.json({ error: 'Field room identity mismatch' }, { status: 409 });
		}

		if (!this.state.fieldId) {
			await this.commit({ ...this.state, fieldId });
		}

		await this.refreshClock();

		const pair = new WebSocketPair();
		const [client, server] = Object.values(pair);
		this.ctx.acceptWebSocket(server);
		server.send(JSON.stringify({ event: 'fieldState', data: publicState(this.state) }));

		return new Response(null, { status: 101, webSocket: client });
	}

	async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
		if (typeof message !== 'string') {
			this.sendError(ws, 'Binary messages are not supported');
			return;
		}

		let payload: unknown;
		try {
			payload = JSON.parse(message);
		} catch {
			this.sendError(ws, 'Message must be valid JSON');
			return;
		}

		if (!isRecord(payload) || typeof payload.event !== 'string') {
			this.sendError(ws, 'Message must contain an event name');
			return;
		}

		try {
			await this.handleEvent({ event: payload.event, data: payload.data });
		} catch (error) {
			const messageText = error instanceof Error ? error.message : 'Realtime action failed';
			this.sendError(ws, messageText);
		}
	}

	async alarm(): Promise<void> {
		if (!this.state.running || this.state.deadlineMs === null) return;

		const next = this.advanceClock(this.state, Date.now());
		const statusChanged = next.status !== this.state.status;
		await this.commit(
			next,
			next.running && next.deadlineMs !== null
				? Math.min(next.deadlineMs, Date.now() + 1_000)
				: null
		);

		if (statusChanged) {
			this.broadcast('fieldState', publicState(next));
		} else {
			this.broadcast('timerUpdate', next.timer);
		}
	}

	private async handleEvent(message: RealtimeMessage): Promise<void> {
		switch (message.event) {
			case 'loadMatch':
				await this.loadMatch(message.data);
				return;
			case 'startMatch':
				await this.startMatch(message.data);
				return;
			case 'pauseMatch':
				await this.pauseMatch(message.data);
				return;
			case 'abortMatch':
				await this.abortMatch(message.data);
				return;
			case 'updateScore':
				await this.updateScore(message.data);
				return;
			case 'submitScore':
				await this.setScoreStatus(message.data, 'submitted');
				return;
			case 'finalizeScore':
				await this.setScoreStatus(message.data, 'finalized');
				return;
			default:
				throw new Error(`Unknown realtime event: ${message.event}`);
		}
	}

	private async loadMatch(data: unknown): Promise<void> {
		if (
			!isRecord(data) ||
			!this.isCurrentField(data.fieldId) ||
			typeof data.matchId !== 'string' ||
			!isStringArray(data.red) ||
			!isStringArray(data.blue)
		) {
			throw new Error('Invalid loadMatch payload');
		}

		const next: StoredFieldState = {
			...this.state,
			matchId: data.matchId,
			status: 'PRE_MATCH',
			timer: MATCH_DURATION_SECONDS,
			liveScore: { red: defaultScore(), blue: defaultScore(), status: 'draft' },
			teams: { red: data.red, blue: data.blue },
			running: false,
			deadlineMs: null
		};

		await this.commit(next, null);
		this.broadcast('fieldState', publicState(next));
	}

	private async startMatch(fieldId: unknown): Promise<void> {
		if (!this.isCurrentField(fieldId)) throw new Error('Invalid field ID');
		if (this.state.status === 'IDLE' || this.state.status === 'MATCH_FINISHED') return;
		if (this.state.running) return;

		const timer = this.state.timer > 0 ? this.state.timer : MATCH_DURATION_SECONDS;
		const next: StoredFieldState = {
			...this.state,
			status: timer > 120 ? 'AUTONOMOUS' : timer > 30 ? 'TELEOP' : 'ENDGAME',
			timer,
			running: true,
			deadlineMs: Date.now() + timer * 1_000
		};

		await this.commit(next, Math.min(next.deadlineMs!, Date.now() + 1_000));
		this.broadcast('fieldState', publicState(next));
	}

	private async pauseMatch(fieldId: unknown): Promise<void> {
		if (!this.isCurrentField(fieldId)) throw new Error('Invalid field ID');

		const current = this.advanceClock(this.state, Date.now());
		const next = { ...current, running: false, deadlineMs: null };
		await this.commit(next, null);
		this.broadcast('fieldState', publicState(next));
	}

	private async abortMatch(fieldId: unknown): Promise<void> {
		if (!this.isCurrentField(fieldId)) throw new Error('Invalid field ID');

		const next: StoredFieldState = {
			...this.state,
			status: 'PRE_MATCH',
			timer: MATCH_DURATION_SECONDS,
			running: false,
			deadlineMs: null
		};
		await this.commit(next, null);
		this.broadcast('fieldState', publicState(next));
	}

	private async updateScore(data: unknown): Promise<void> {
		if (
			!isRecord(data) ||
			!this.isCurrentField(data.fieldId) ||
			!isAlliance(data.alliance) ||
			!isScoreUpdate(data.scoreUpdate)
		) {
			throw new Error('Invalid updateScore payload');
		}
		if (this.state.liveScore.status !== 'draft') return;

		const allianceScore = { ...this.state.liveScore[data.alliance], ...data.scoreUpdate };
		allianceScore.total =
			(allianceScore.teleIndependent + allianceScore.sharedScore + allianceScore.endgame) *
				allianceScore.balanceMultiplier -
			allianceScore.penalties;

		const next: StoredFieldState = {
			...this.state,
			liveScore: {
				...this.state.liveScore,
				[data.alliance]: allianceScore
			}
		};
		await this.commit(next);
		this.broadcast('scoreUpdate', next.liveScore);
	}

	private async setScoreStatus(fieldId: unknown, status: 'submitted' | 'finalized'): Promise<void> {
		if (!this.isCurrentField(fieldId)) throw new Error('Invalid field ID');

		const next: StoredFieldState = {
			...this.state,
			liveScore: { ...this.state.liveScore, status }
		};
		await this.commit(next);
		this.broadcast('fieldState', publicState(next));
	}

	private async refreshClock(): Promise<void> {
		if (!this.state.running || this.state.deadlineMs === null) return;
		const next = this.advanceClock(this.state, Date.now());
		if (next.timer !== this.state.timer || next.status !== this.state.status) {
			await this.commit(
				next,
				next.running && next.deadlineMs !== null
					? Math.min(next.deadlineMs, Date.now() + 1_000)
					: null
			);
		}
	}

	private advanceClock(state: StoredFieldState, now: number): StoredFieldState {
		if (!state.running || state.deadlineMs === null) return state;

		const timer = Math.max(0, Math.ceil((state.deadlineMs - now) / 1_000));
		const status: FieldStatus =
			timer === 0
				? 'MATCH_FINISHED'
				: timer <= 30
					? 'ENDGAME'
					: timer <= 120
						? 'TELEOP'
						: 'AUTONOMOUS';

		return {
			...state,
			timer,
			status,
			running: timer > 0,
			deadlineMs: timer > 0 ? state.deadlineMs : null
		};
	}

	private async commit(next: StoredFieldState, alarmAt?: number | null): Promise<void> {
		const operations: Promise<unknown>[] = [this.ctx.storage.put(STATE_KEY, next)];
		if (alarmAt === null) operations.push(this.ctx.storage.deleteAlarm());
		if (typeof alarmAt === 'number') operations.push(this.ctx.storage.setAlarm(alarmAt));

		await Promise.all(operations);
		this.state = next;
	}

	private broadcast(event: string, data: unknown): void {
		const payload = JSON.stringify({ event, data });
		for (const socket of this.ctx.getWebSockets()) {
			try {
				socket.send(payload);
			} catch {
				// The client disconnected while broadcasting.
			}
		}
	}

	private sendError(ws: WebSocket, message: string): void {
		ws.send(JSON.stringify({ event: 'error', data: { message } }));
	}

	private isCurrentField(value: unknown): value is string {
		return typeof value === 'string' && value === this.state.fieldId;
	}

	private fieldIdFromRequest(request: Request): string | null {
		const match = new URL(request.url).pathname.match(/^\/ws\/fields\/([0-9a-f]{24})$/i);
		return match?.[1] ?? null;
	}
}
