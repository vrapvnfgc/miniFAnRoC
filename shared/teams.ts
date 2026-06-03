// ============================================================
// teams.ts — Team model, store, and registration logic
// Imports: fields.ts (TEAM_REGISTER_FIELDS), users.ts (User)
// Imported by: index.ts, scores.ts, matches.ts, rankings.ts
// ============================================================

import { writable, derived } from 'svelte/store';
import type { FormField } from '../types/fields';
import { TEAM_REGISTER_FIELDS } from '../types/fields';

// ── Types ──────────────────────────────────────────────────
export interface Team {
	id: string;
	name: string;
	leaderName: string;
	leaderEmail: string;
	memberCount: number;
	score: number;
	registeredAt: string;
	status: 'active' | 'disqualified' | 'pending';
}

export interface TeamRegistrationPayload {
	leaderEmail: string;
	teamName: string;
	leaderName: string;
	memberCount: number;
}

export interface RegistrationResult {
	success: boolean;
	message: { en: string; vi: string };
	team?: Team;
}

// ── Admin email for notifications ─────────────────────────
export const ADMIN_NOTIFICATION_EMAIL = 'xthavan@gmail.com';

// ── Mock initial data ──────────────────────────────────────
const INITIAL_TEAMS: Team[] = [
	{
		id: 't1',
		name: 'Quantum Surge',
		leaderName: 'Nguyễn Minh Khoa',
		leaderEmail: 'khoa@example.com',
		memberCount: 4,
		score: 980,
		registeredAt: '2025-02-10',
		status: 'active'
	},
	{
		id: 't2',
		name: 'Neural Storm',
		leaderName: 'Trần Bảo Châu',
		leaderEmail: 'chau@example.com',
		memberCount: 3,
		score: 870,
		registeredAt: '2025-02-11',
		status: 'active'
	},
	{
		id: 't3',
		name: 'ByteForce',
		leaderName: 'Lê Thùy Dung',
		leaderEmail: 'dung@example.com',
		memberCount: 5,
		score: 820,
		registeredAt: '2025-02-12',
		status: 'active'
	},
	{
		id: 't4',
		name: 'CyberNova',
		leaderName: 'Phạm Đức Anh',
		leaderEmail: 'anh@example.com',
		memberCount: 4,
		score: 760,
		registeredAt: '2025-02-13',
		status: 'active'
	},
	{
		id: 't5',
		name: 'AlphaBot',
		leaderName: 'Hoàng Ngọc Linh',
		leaderEmail: 'linh@example.com',
		memberCount: 3,
		score: 700,
		registeredAt: '2025-02-14',
		status: 'active'
	},
	{
		id: 't6',
		name: 'TechVanguard',
		leaderName: 'Vũ Thanh Hà',
		leaderEmail: 'ha@example.com',
		memberCount: 5,
		score: 650,
		registeredAt: '2025-02-15',
		status: 'active'
	},
	{
		id: 't7',
		name: 'DataPioneers',
		leaderName: 'Đỗ Mạnh Tuấn',
		leaderEmail: 'tuan@example.com',
		memberCount: 2,
		score: 590,
		registeredAt: '2025-02-16',
		status: 'active'
	},
	{
		id: 't8',
		name: 'RoboElites',
		leaderName: 'Ngô Hải Yến',
		leaderEmail: 'yen@example.com',
		memberCount: 4,
		score: 520,
		registeredAt: '2025-02-17',
		status: 'active'
	}
];

// ── Store ──────────────────────────────────────────────────
function createTeamStore() {
	const { subscribe, update, set } = writable<Team[]>(INITIAL_TEAMS);

	function generateId(): string {
		return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
	}

	async function registerTeam(payload: TeamRegistrationPayload): Promise<RegistrationResult> {
		// Validate all fields
		const fields: FormField[] = TEAM_REGISTER_FIELDS;
		for (const field of fields) {
			const val = payload[field.key as keyof TeamRegistrationPayload];
			if (field.required && (val === undefined || val === '' || val === null)) {
				return {
					success: false,
					message: {
						en: `${field.labelEn} is required.`,
						vi: `${field.labelVi} là bắt buộc.`
					}
				};
			}
			if (field.validation && val !== undefined) {
				const err = field.validation(val as string);
				if (err) {
					return {
						success: false,
						message: { en: err, vi: err }
					};
				}
			}
		}

		// Simulate email notification (in production, call server API)
		console.info(
			`[Teams] Registration email would be sent to ${ADMIN_NOTIFICATION_EMAIL}`,
			payload
		);

		const newTeam: Team = {
			id: generateId(),
			name: payload.teamName,
			leaderName: payload.leaderName,
			leaderEmail: payload.leaderEmail,
			memberCount: payload.memberCount,
			score: 0,
			registeredAt: new Date().toISOString().split('T')[0],
			status: 'active'
		};

		update((teams) => [...teams, newTeam]);

		return {
			success: true,
			message: {
				en: `Team "${newTeam.name}" registered successfully! A confirmation has been sent to ${ADMIN_NOTIFICATION_EMAIL}.`,
				vi: `Đội "${newTeam.name}" đã đăng ký thành công! Xác nhận đã được gửi đến ${ADMIN_NOTIFICATION_EMAIL}.`
			},
			team: newTeam
		};
	}

	return { subscribe, update, set, registerTeam };
}

export const teamStore = createTeamStore();

// ── Derived ────────────────────────────────────────────────
export const sortedTeams = derived(teamStore, ($teams) =>
	[...$teams].filter((t) => t.status === 'active').sort((a, b) => b.score - a.score)
);

export const teamCount = derived(teamStore, ($teams) => $teams.length);

export const activeTeamCount = derived(
	teamStore,
	($teams) => $teams.filter((t) => t.status === 'active').length
);
