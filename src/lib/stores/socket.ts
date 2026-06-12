import { io, Socket } from 'socket.io-client';
import { writable, type Writable } from 'svelte/store';
import { env } from '$env/dynamic/public';
import type { IAllianceScore } from '@shared';

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

let socket: Socket | null = null;

export const fieldState: Writable<FieldState | null> = writable(null);
export const isConnected = writable(false);

export function connectToField(fieldId: string) {
	if (socket) {
		socket.disconnect();
	}

	const url = env.PUBLIC_BACKEND_URL || 'http://localhost:3000';
	socket = io(url);

	socket.on('connect', () => {
		isConnected.set(true);
		socket?.emit('joinField', fieldId);
	});

	socket.on('disconnect', () => {
		isConnected.set(false);
	});

	socket.on('fieldState', (state: FieldState) => {
		fieldState.set(state);
	});

	socket.on('timerUpdate', (timer: number) => {
		fieldState.update(s => s ? { ...s, timer } : s);
	});

	socket.on('scoreUpdate', (liveScore: FieldState['liveScore']) => {
		fieldState.update(s => s ? { ...s, liveScore } : s);
	});
}

export function disconnectFromField() {
	if (socket) {
		socket.disconnect();
		socket = null;
		isConnected.set(false);
		fieldState.set(null);
	}
}

// Controller Actions
export function loadMatch(fieldId: string, matchId: string, red: string[], blue: string[]) {
	socket?.emit('loadMatch', { fieldId, matchId, red, blue });
}
export function startMatch(fieldId: string) {
	socket?.emit('startMatch', fieldId);
}
export function pauseMatch(fieldId: string) {
	socket?.emit('pauseMatch', fieldId);
}
export function abortMatch(fieldId: string) {
	socket?.emit('abortMatch', fieldId);
}

// Scorekeeper Actions
export function updateScore(fieldId: string, alliance: 'red' | 'blue', scoreUpdate: Partial<IAllianceScore>) {
	socket?.emit('updateScore', { fieldId, alliance, scoreUpdate });
}
export function submitScore(fieldId: string) {
	socket?.emit('submitScore', fieldId);
}

// Referee Actions
export function finalizeScore(fieldId: string) {
	socket?.emit('finalizeScore', fieldId);
}
