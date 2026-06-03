// ============================================================
// scores.ts — Score model and store
// Imports: teams.ts (Team), users.ts (User)
// Imported by: rankings.ts, matches.ts, index.ts
// ============================================================

import { writable, derived } from 'svelte/store';
import { teamStore } from './teams';

// ── Types ──────────────────────────────────────────────────
export interface ScoreEntry {
	id: string;
	teamId: string;
	teamName: string;
	round: number;
	task: string;
	points: number;
	judgeId: string;
	timestamp: string;
	notes?: string;
}

export interface TeamScoreSummary {
	teamId: string;
	teamName: string;
	totalScore: number;
	roundScores: Record<number, number>;
	entries: ScoreEntry[];
}

// ── Mock data ──────────────────────────────────────────────
const MOCK_SCORES: ScoreEntry[] = [
	{
		id: 's1',
		teamId: 't1',
		teamName: 'Quantum Surge',
		round: 1,
		task: 'Autonomous Navigation',
		points: 320,
		judgeId: 'u2',
		timestamp: '2025-03-01T10:00:00Z'
	},
	{
		id: 's2',
		teamId: 't1',
		teamName: 'Quantum Surge',
		round: 2,
		task: 'Object Recognition',
		points: 350,
		judgeId: 'u2',
		timestamp: '2025-03-02T10:00:00Z'
	},
	{
		id: 's3',
		teamId: 't1',
		teamName: 'Quantum Surge',
		round: 3,
		task: 'Strategy Challenge',
		points: 310,
		judgeId: 'u2',
		timestamp: '2025-03-03T10:00:00Z'
	},
	{
		id: 's4',
		teamId: 't2',
		teamName: 'Neural Storm',
		round: 1,
		task: 'Autonomous Navigation',
		points: 290,
		judgeId: 'u2',
		timestamp: '2025-03-01T11:00:00Z'
	},
	{
		id: 's5',
		teamId: 't2',
		teamName: 'Neural Storm',
		round: 2,
		task: 'Object Recognition',
		points: 310,
		judgeId: 'u2',
		timestamp: '2025-03-02T11:00:00Z'
	},
	{
		id: 's6',
		teamId: 't2',
		teamName: 'Neural Storm',
		round: 3,
		task: 'Strategy Challenge',
		points: 270,
		judgeId: 'u2',
		timestamp: '2025-03-03T11:00:00Z'
	},
	{
		id: 's7',
		teamId: 't3',
		teamName: 'ByteForce',
		round: 1,
		task: 'Autonomous Navigation',
		points: 270,
		judgeId: 'u2',
		timestamp: '2025-03-01T12:00:00Z'
	},
	{
		id: 's8',
		teamId: 't3',
		teamName: 'ByteForce',
		round: 2,
		task: 'Object Recognition',
		points: 285,
		judgeId: 'u2',
		timestamp: '2025-03-02T12:00:00Z'
	},
	{
		id: 's9',
		teamId: 't3',
		teamName: 'ByteForce',
		round: 3,
		task: 'Strategy Challenge',
		points: 265,
		judgeId: 'u2',
		timestamp: '2025-03-03T12:00:00Z'
	}
];

// ── Store ──────────────────────────────────────────────────
function createScoreStore() {
	const { subscribe, update, set } = writable<ScoreEntry[]>(MOCK_SCORES);

	function addScore(entry: Omit<ScoreEntry, 'id' | 'timestamp'>): void {
		const newEntry: ScoreEntry = {
			...entry,
			id: 's' + Date.now().toString(36),
			timestamp: new Date().toISOString()
		};
		update((scores) => [...scores, newEntry]);

		// Sync back to team store
		teamStore.update((teams) =>
			teams.map((team) => {
				if (team.id === entry.teamId) {
					const total = [...MOCK_SCORES, newEntry]
						.filter((s) => s.teamId === team.id)
						.reduce((sum, s) => sum + s.points, 0);
					return { ...team, score: total };
				}
				return team;
			})
		);
	}

	return { subscribe, update, set, addScore };
}

export const scoreStore = createScoreStore();

// ── Derived: per-team summaries ────────────────────────────
export const teamScoreSummaries = derived(scoreStore, ($scores) => {
	const map = new Map<string, TeamScoreSummary>();
	for (const entry of $scores) {
		if (!map.has(entry.teamId)) {
			map.set(entry.teamId, {
				teamId: entry.teamId,
				teamName: entry.teamName,
				totalScore: 0,
				roundScores: {},
				entries: []
			});
		}
		const summary = map.get(entry.teamId)!;
		summary.totalScore += entry.points;
		summary.roundScores[entry.round] = (summary.roundScores[entry.round] ?? 0) + entry.points;
		summary.entries.push(entry);
	}
	return [...map.values()].sort((a, b) => b.totalScore - a.totalScore);
});
