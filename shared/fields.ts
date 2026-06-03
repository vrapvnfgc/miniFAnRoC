// ============================================================
// fields.ts — Field/Column definitions for tables & forms
// Used by: teams.ts, rankings.ts, scores.ts, matches.ts
// ============================================================

export type FieldType = 'text' | 'email' | 'number' | 'select' | 'date' | 'badge' | 'rank';

export interface TableField<T = unknown> {
	key: keyof T | string;
	labelEn: string;
	labelVi: string;
	type: FieldType;
	sortable?: boolean;
	width?: string;
	align?: 'left' | 'center' | 'right';
	render?: (value: unknown, row: T) => string;
}

export interface FormField {
	key: string;
	labelEn: string;
	labelVi: string;
	type: 'text' | 'email' | 'number' | 'select' | 'textarea';
	placeholder?: { en: string; vi: string };
	required?: boolean;
	min?: number;
	max?: number;
	options?: { value: string; labelEn: string; labelVi: string }[];
	validation?: (value: string | number) => string | null;
}

// ── Team table fields ──────────────────────────────────────
export const TEAM_TABLE_FIELDS: TableField[] = [
	{
		key: 'rank',
		labelEn: '#',
		labelVi: 'STT',
		type: 'rank',
		width: '60px',
		align: 'center'
	},
	{
		key: 'name',
		labelEn: 'Team Name',
		labelVi: 'Tên Đội',
		type: 'text',
		sortable: true,
		align: 'left'
	},
	{
		key: 'memberCount',
		labelEn: 'Members',
		labelVi: 'Thành Viên',
		type: 'number',
		sortable: true,
		align: 'center',
		width: '120px'
	},
	{
		key: 'score',
		labelEn: 'Score',
		labelVi: 'Điểm',
		type: 'number',
		sortable: true,
		align: 'center',
		width: '100px'
	}
];

// ── Team register form fields ──────────────────────────────
export const TEAM_REGISTER_FIELDS: FormField[] = [
	{
		key: 'leaderEmail',
		labelEn: 'Team Leader Email',
		labelVi: 'Email Đội Trưởng',
		type: 'email',
		placeholder: { en: 'leader@example.com', vi: 'doitruong@email.com' },
		required: true,
		validation: (v) => {
			const email = String(v);
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? null : 'Invalid email address';
		}
	},
	{
		key: 'teamName',
		labelEn: 'Team Name',
		labelVi: 'Tên Đội',
		type: 'text',
		placeholder: { en: 'Enter team name', vi: 'Nhập tên đội' },
		required: true,
		validation: (v) => (String(v).trim().length >= 3 ? null : 'Minimum 3 characters')
	},
	{
		key: 'leaderName',
		labelEn: 'Team Leader Name',
		labelVi: 'Tên Đội Trưởng',
		type: 'text',
		placeholder: { en: 'Full name', vi: 'Họ và tên' },
		required: true,
		validation: (v) => (String(v).trim().length >= 2 ? null : 'Minimum 2 characters')
	},
	{
		key: 'memberCount',
		labelEn: 'Number of Members',
		labelVi: 'Số Lượng Thành Viên',
		type: 'number',
		placeholder: { en: '1–10', vi: '1–10' },
		required: true,
		min: 1,
		max: 10,
		validation: (v) => {
			const n = Number(v);
			return n >= 1 && n <= 10 ? null : 'Must be between 1 and 10';
		}
	}
];

// ── Rankings table fields ──────────────────────────────────
export const RANKING_TABLE_FIELDS: TableField[] = [
	{
		key: 'position',
		labelEn: 'Rank',
		labelVi: 'Hạng',
		type: 'rank',
		width: '70px',
		align: 'center'
	},
	{
		key: 'teamName',
		labelEn: 'Team',
		labelVi: 'Đội',
		type: 'text',
		sortable: true,
		align: 'left'
	},
	{
		key: 'totalScore',
		labelEn: 'Total Score',
		labelVi: 'Tổng Điểm',
		type: 'number',
		sortable: true,
		align: 'center',
		width: '120px'
	},
	{
		key: 'wins',
		labelEn: 'W',
		labelVi: 'T',
		type: 'number',
		align: 'center',
		width: '60px'
	},
	{
		key: 'losses',
		labelEn: 'L',
		labelVi: 'B',
		type: 'number',
		align: 'center',
		width: '60px'
	}
];
