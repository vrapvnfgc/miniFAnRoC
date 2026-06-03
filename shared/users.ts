// ============================================================
// users.ts — User model, store, and helpers
// Imports: nothing from this project (base layer)
// Imported by: teams.ts, scores.ts, matches.ts
// ============================================================

import { writable, derived } from 'svelte/store';

// ── Types ──────────────────────────────────────────────────
export type UserRole = 'admin' | 'judge' | 'viewer' | 'team_leader';

export interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	avatarInitials: string;
	createdAt: string;
}

// ── Mock data ──────────────────────────────────────────────
const MOCK_USERS: User[] = [
	{
		id: 'u1',
		name: 'Nguyễn Văn A',
		email: 'nguyenvana@example.com',
		role: 'admin',
		avatarInitials: 'NA',
		createdAt: '2025-01-01'
	},
	{
		id: 'u2',
		name: 'Trần Thị B',
		email: 'tranthib@example.com',
		role: 'judge',
		avatarInitials: 'TB',
		createdAt: '2025-01-02'
	},
	{
		id: 'u3',
		name: 'Lê Văn C',
		email: 'levanc@example.com',
		role: 'team_leader',
		avatarInitials: 'LC',
		createdAt: '2025-01-03'
	}
];

// ── Store ──────────────────────────────────────────────────
function createUserStore() {
	const { subscribe, set, update } = writable<User[]>(MOCK_USERS);

	return {
		subscribe,
		set,
		update,
		getById: (id: string): User | undefined => {
			let found: User | undefined;
			const unsub = subscribe((users) => {
				found = users.find((u) => u.id === id);
			});
			unsub();
			return found;
		}
	};
}

export const userStore = createUserStore();

// ── Derived helpers ────────────────────────────────────────
export const adminUsers = derived(userStore, ($users) => $users.filter((u) => u.role === 'admin'));

export const judgeUsers = derived(userStore, ($users) => $users.filter((u) => u.role === 'judge'));

// ── Utility ────────────────────────────────────────────────
export function formatUserRole(role: UserRole, lang: 'en' | 'vi'): string {
	const map: Record<UserRole, { en: string; vi: string }> = {
		admin: { en: 'Admin', vi: 'Quản Trị' },
		judge: { en: 'Judge', vi: 'Giám Khảo' },
		viewer: { en: 'Viewer', vi: 'Khán Giả' },
		team_leader: { en: 'Team Leader', vi: 'Đội Trưởng' }
	};
	return map[role][lang];
}
