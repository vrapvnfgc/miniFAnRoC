// ============================================================
// index.ts — Central barrel export for all stores & types
// This is the single entry point for the application's data layer.
// Imports: fields.ts, users.ts, teams.ts, scores.ts,
//          matches.ts, rankings.ts
// ============================================================

// ── Types / Field Definitions ──────────────────────────────
export type { TableField, FormField, FieldType } from '../types/fields';
export { TEAM_TABLE_FIELDS, TEAM_REGISTER_FIELDS, RANKING_TABLE_FIELDS } from '../types/fields';

// ── Users ──────────────────────────────────────────────────
export type { User, UserRole } from './users';
export { userStore, adminUsers, judgeUsers, formatUserRole } from './users';

// ── Teams ──────────────────────────────────────────────────
export type { Team, TeamRegistrationPayload, RegistrationResult } from './teams';
export {
	teamStore,
	sortedTeams,
	teamCount,
	activeTeamCount,
	ADMIN_NOTIFICATION_EMAIL
} from './teams';

// ── Scores ─────────────────────────────────────────────────
export type { ScoreEntry, TeamScoreSummary } from './scores';
export { scoreStore, teamScoreSummaries } from './scores';

// ── Matches ────────────────────────────────────────────────
export type { Match, MatchStatus } from './matches';
export {
	matchStore,
	upcomingMatches,
	completedMatches,
	liveMatches,
	formatMatchDate
} from './matches';

// ── Rankings ───────────────────────────────────────────────
export type { RankingEntry } from './ranking';
export { rankings, podium, getMedalEmoji, getMedalClass } from './ranking';

// ── Language helper ────────────────────────────────────────
export type Lang = 'en' | 'vi';

export function t(en: string, vi: string, lang: Lang): string {
	return lang === 'vi' ? vi : en;
}
