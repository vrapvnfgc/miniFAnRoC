// ============================================================
// matches.ts — Match/fixture model and store
// Imports: teams.ts (Team), scores.ts (ScoreEntry)
// Imported by: rankings.ts, index.ts
// ============================================================

import { writable, derived } from 'svelte/store';

// ── Types ──────────────────────────────────────────────────
export type MatchStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface Match {
	id: string;
	round: number;
	teamAId: string;
	teamAName: string;
	teamBId: string;
	teamBName: string;
	teamAScore: number;
	teamBScore: number;
	status: MatchStatus;
	scheduledAt: string;
	field: string;
	winnerId?: string;
}

// ── Mock data ──────────────────────────────────────────────
const MOCK_MATCHES: Match[] = [
	{
		id: 'm1',
		round: 1,
		teamAId: 't1',
		teamAName: 'Quantum Surge',
		teamBId: 't2',
		teamBName: 'Neural Storm',
		teamAScore: 320,
		teamBScore: 290,
		status: 'completed',
		scheduledAt: '2025-03-01T09:00:00Z',
		field: 'Arena A',
		winnerId: 't1'
	},
	{
		id: 'm2',
		round: 1,
		teamAId: 't3',
		teamAName: 'ByteForce',
		teamBId: 't4',
		teamBName: 'CyberNova',
		teamAScore: 270,
		teamBScore: 250,
		status: 'completed',
		scheduledAt: '2025-03-01T11:00:00Z',
		field: 'Arena B',
		winnerId: 't3'
	},
	{
		id: 'm3',
		round: 2,
		teamAId: 't1',
		teamAName: 'Quantum Surge',
		teamBId: 't3',
		teamBName: 'ByteForce',
		teamAScore: 350,
		teamBScore: 285,
		status: 'completed',
		scheduledAt: '2025-03-02T09:00:00Z',
		field: 'Arena A',
		winnerId: 't1'
	},
	{
		id: 'm4',
		round: 2,
		teamAId: 't5',
		teamAName: 'AlphaBot',
		teamBId: 't6',
		teamBName: 'TechVanguard',
		teamAScore: 230,
		teamBScore: 210,
		status: 'completed',
		scheduledAt: '2025-03-02T11:00:00Z',
		field: 'Arena B',
		winnerId: 't5'
	},
	{
		id: 'm5',
		round: 3,
		teamAId: 't1',
		teamAName: 'Quantum Surge',
		teamBId: 't5',
		teamBName: 'AlphaBot',
		teamAScore: 0,
		teamBScore: 0,
		status: 'upcoming',
		scheduledAt: '2025-06-15T09:00:00Z',
		field: 'Main Stage'
	},
	{
		id: 'm6',
		round: 3,
		teamAId: 't2',
		teamAName: 'Neural Storm',
		teamBId: 't4',
		teamBName: 'CyberNova',
		teamAScore: 0,
		teamBScore: 0,
		status: 'upcoming',
		scheduledAt: '2025-06-15T11:00:00Z',
		field: 'Arena A'
	}
];

// ── Store ──────────────────────────────────────────────────
function createMatchStore() {
	const { subscribe, update, set } = writable<Match[]>(MOCK_MATCHES);

	function completeMatch(matchId: string, teamAScore: number, teamBScore: number): void {
		update((matches) =>
			matches.map((m) => {
				if (m.id !== matchId) return m;
				const winnerId =
					teamAScore > teamBScore ? m.teamAId : teamBScore > teamAScore ? m.teamBId : undefined;
				return { ...m, teamAScore, teamBScore, status: 'completed', winnerId };
			})
		);
	}

	return { subscribe, update, set, completeMatch };
}

export const matchStore = createMatchStore();

// ── Derived ────────────────────────────────────────────────
export const upcomingMatches = derived(matchStore, ($matches) =>
	$matches
		.filter((m) => m.status === 'upcoming')
		.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
);

export const completedMatches = derived(matchStore, ($matches) =>
	$matches
		.filter((m) => m.status === 'completed')
		.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
);

export const liveMatches = derived(matchStore, ($matches) =>
	$matches.filter((m) => m.status === 'live')
);

export function formatMatchDate(iso: string, lang: 'en' | 'vi'): string {
	const d = new Date(iso);
	if (lang === 'vi') {
		return d.toLocaleString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
	return d.toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}
