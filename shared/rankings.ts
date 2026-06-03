// ============================================================
// rankings.ts — Rankings computation
// Imports: teams.ts, scores.ts, matches.ts
// Imported by: index.ts
// ============================================================

import { derived } from 'svelte/store';
import { teamStore } from './teams';
import { matchStore } from './matches';

// ── Types ──────────────────────────────────────────────────
export interface RankingEntry {
	position: number;
	teamId: string;
	teamName: string;
	totalScore: number;
	wins: number;
	losses: number;
	matchesPlayed: number;
	memberCount: number;
	trend: 'up' | 'down' | 'same';
}

// ── Derived ranking ────────────────────────────────────────
export const rankings = derived([teamStore, matchStore], ([$teams, $matches]) => {
	const completed = $matches.filter((m) => m.status === 'completed');

	const statsMap = new Map<string, { wins: number; losses: number; played: number }>();

	for (const match of completed) {
		if (!statsMap.has(match.teamAId))
			statsMap.set(match.teamAId, { wins: 0, losses: 0, played: 0 });
		if (!statsMap.has(match.teamBId))
			statsMap.set(match.teamBId, { wins: 0, losses: 0, played: 0 });

		const a = statsMap.get(match.teamAId)!;
		const b = statsMap.get(match.teamBId)!;
		a.played++;
		b.played++;

		if (match.winnerId === match.teamAId) {
			a.wins++;
			b.losses++;
		} else if (match.winnerId === match.teamBId) {
			b.wins++;
			a.losses++;
		}
	}

	const entries: RankingEntry[] = $teams
		.filter((t) => t.status === 'active')
		.map((team) => {
			const stats = statsMap.get(team.id) ?? { wins: 0, losses: 0, played: 0 };
			return {
				position: 0,
				teamId: team.id,
				teamName: team.name,
				totalScore: team.score,
				wins: stats.wins,
				losses: stats.losses,
				matchesPlayed: stats.played,
				memberCount: team.memberCount,
				trend: 'same' as const
			};
		})
		.sort((a, b) => b.totalScore - a.totalScore)
		.map((entry, i) => ({ ...entry, position: i + 1 }));

	return entries;
});

// ── Top 3 podium ───────────────────────────────────────────
export const podium = derived(rankings, ($rankings) => $rankings.slice(0, 3));

// ── Helpers ────────────────────────────────────────────────
export function getMedalEmoji(position: number): string {
	if (position === 1) return '🥇';
	if (position === 2) return '🥈';
	if (position === 3) return '🥉';
	return '';
}

export function getMedalClass(position: number): string {
	if (position === 1) return 'gold';
	if (position === 2) return 'silver';
	if (position === 3) return 'bronze';
	return '';
}
