import { Server, Socket } from 'socket.io';
import { IAllianceScore, MatchScoreModel, MatchModel } from '@shared';

export type FieldStatus = 'IDLE' | 'PRE_MATCH' | 'AUTONOMOUS' | 'TELEOP' | 'ENDGAME' | 'MATCH_FINISHED';

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

const defaultScore = (): IAllianceScore => ({
	teleIndependent: 0,
	sharedScore: 0,
	penalties: 0,
	endgame: 0,
	balanceMultiplier: 1,
	total: 0
});

export class FieldManager {
	private fields = new Map<string, FieldState>();
	private io: Server;
	private timers = new Map<string, NodeJS.Timeout>();

	constructor(io: Server) {
		this.io = io;
	}

	public getFieldState(fieldId: string): FieldState {
		if (!this.fields.has(fieldId)) {
			this.fields.set(fieldId, {
				fieldId,
				matchId: null,
				status: 'IDLE',
				timer: 0,
				liveScore: { red: defaultScore(), blue: defaultScore(), status: 'draft' },
				teams: { red: [], blue: [] }
			});
		}
		return this.fields.get(fieldId)!;
	}

	public async loadMatch(fieldId: string, matchId: string) {
		const state = this.getFieldState(fieldId);
		// Fetch match from DB (You would typically inject the MatchService or use the Mongoose model directly)
		// For simplicity, we assume we fetch it or client sends details. We will just set matchId.
		state.matchId = matchId;
		state.status = 'PRE_MATCH';
		state.timer = 120; // 2.5 minutes total (30s auto, 120s teleop)
		state.liveScore = { red: defaultScore(), blue: defaultScore(), status: 'draft' };

		// Typically, fetch teams from match
		// state.teams = { red: match.redTeamIds, blue: match.blueTeamIds };

		this.broadcastFieldState(fieldId);
	}

	public setTeams(fieldId: string, red: string[], blue: string[]) {
		const state = this.getFieldState(fieldId);
		state.teams = { red, blue };
		this.broadcastFieldState(fieldId);
	}

	public startMatch(fieldId: string) {
		const state = this.getFieldState(fieldId);
		if (state.status === 'IDLE' || state.status === 'MATCH_FINISHED') return;

		if (state.status === 'PRE_MATCH') {
			state.status = 'AUTONOMOUS';
			state.timer = 120;
		} else if (state.status === 'AUTONOMOUS' && state.timer <= 120) {
			state.status = 'TELEOP';
		}

		this.broadcastFieldState(fieldId);

		if (this.timers.has(fieldId)) {
			clearInterval(this.timers.get(fieldId));
		}

		const interval = setInterval(() => {
			if (state.timer > 0) {
				state.timer--;

				if (state.timer === 120 && state.status === 'AUTONOMOUS') {
					state.status = 'TELEOP';
					this.broadcastFieldState(fieldId);
				} else if (state.timer === 30 && state.status === 'TELEOP') {
					state.status = 'ENDGAME';
					this.broadcastFieldState(fieldId);
				} else if (state.timer === 0) {
					state.status = 'MATCH_FINISHED';
					clearInterval(this.timers.get(fieldId));
					this.timers.delete(fieldId);
					this.broadcastFieldState(fieldId);
				} else {
					// Just broadcast timer
					this.io.to(`field:${fieldId}`).emit('timerUpdate', state.timer);
				}
			}
		}, 1000);

		this.timers.set(fieldId, interval);
	}

	public pauseMatch(fieldId: string) {
		if (this.timers.has(fieldId)) {
			clearInterval(this.timers.get(fieldId));
			this.timers.delete(fieldId);
		}
	}

	public abortMatch(fieldId: string) {
		this.pauseMatch(fieldId);
		const state = this.getFieldState(fieldId);
		state.status = 'PRE_MATCH';
		state.timer = 120;
		this.broadcastFieldState(fieldId);
	}

	public updateScore(fieldId: string, alliance: 'red' | 'blue', scoreUpdate: Partial<IAllianceScore>) {
		const state = this.getFieldState(fieldId);
		if (state.liveScore.status !== 'draft') return; // Cannot update if submitted/finalized

		Object.assign(state.liveScore[alliance], scoreUpdate);
		// Recalculate total
		const s = state.liveScore[alliance];
		s.total = (s.teleIndependent || 0) * (s.balanceMultiplier || 1) + (s.sharedScore || 0) + (s.endgame || 0) - (s.penalties || 0);

		this.io.to(`field:${fieldId}`).emit('scoreUpdate', state.liveScore);
	}

	public submitScore(fieldId: string) {
		const state = this.getFieldState(fieldId);
		state.liveScore.status = 'submitted';
		this.broadcastFieldState(fieldId);
	}

	public async finalizeScore(fieldId: string) {
		const state = this.getFieldState(fieldId);
		state.liveScore.status = 'finalized';
		this.broadcastFieldState(fieldId);

		// In a full implementation, you would save `state.liveScore` to `MatchScoreModel` here
		// and update `RankingsService` to recalculate.
	}

	private broadcastFieldState(fieldId: string) {
		this.io.to(`field:${fieldId}`).emit('fieldState', this.fields.get(fieldId));
	}

	public handleConnection(socket: Socket) {
		socket.on('joinField', (fieldId: string) => {
			socket.join(`field:${fieldId}`);
			socket.emit('fieldState', this.getFieldState(fieldId));
		});

		socket.on('loadMatch', (data: { fieldId: string; matchId: string; red: string[], blue: string[] }) => {
			this.loadMatch(data.fieldId, data.matchId);
			this.setTeams(data.fieldId, data.red, data.blue);
		});

		socket.on('startMatch', (fieldId: string) => this.startMatch(fieldId));
		socket.on('pauseMatch', (fieldId: string) => this.pauseMatch(fieldId));
		socket.on('abortMatch', (fieldId: string) => this.abortMatch(fieldId));

		socket.on('updateScore', (data: { fieldId: string; alliance: 'red' | 'blue'; scoreUpdate: Partial<IAllianceScore> }) => {
			this.updateScore(data.fieldId, data.alliance, data.scoreUpdate);
		});

		socket.on('submitScore', (fieldId: string) => this.submitScore(fieldId));
		socket.on('finalizeScore', async (fieldId: string) => await this.finalizeScore(fieldId));
	}
}
