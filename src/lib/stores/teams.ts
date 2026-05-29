import { writable, derived } from 'svelte/store';

export type TeamStatus = 'active' | 'pending' | 'eliminated';

export interface Team {
	id: string;
	rank: number;
	name: string;
	captainName: string;
	captainEmail: string;
	memberCount: number;
	score: number;
	status: TeamStatus;
	registeredAt: Date;
}

export interface TeamFormData {
	captainEmail: string;
	teamName: string;
	captainName: string;
	memberCount: number;
}

// Fake initial data
const initialTeams: Team[] = [
	{
		id: '1',
		rank: 1,
		name: 'Quantum Nexus',
		captainName: 'Nguyễn Minh Khoa',
		captainEmail: 'khoa.nm@fpt.edu.vn',
		memberCount: 5,
		score: 2840,
		status: 'active',
		registeredAt: new Date('2025-01-15')
	},
	{
		id: '2',
		rank: 2,
		name: 'CyberDragon VN',
		captainName: 'Trần Thị Lan Anh',
		captainEmail: 'lananh.tt@fpt.edu.vn',
		memberCount: 6,
		score: 2710,
		status: 'active',
		registeredAt: new Date('2025-01-16')
	},
	{
		id: '3',
		rank: 3,
		name: 'Iron Phoenix',
		captainName: 'Lê Văn Hùng',
		captainEmail: 'hung.lv@hust.edu.vn',
		memberCount: 4,
		score: 2590,
		status: 'active',
		registeredAt: new Date('2025-01-17')
	},
	{
		id: '4',
		rank: 4,
		name: 'NeuralStorm',
		captainName: 'Phạm Đức Thành',
		captainEmail: 'thanh.pd@uet.vnu.edu.vn',
		memberCount: 5,
		score: 2430,
		status: 'active',
		registeredAt: new Date('2025-01-18')
	},
	{
		id: '5',
		rank: 5,
		name: 'RoboViet Elite',
		captainName: 'Võ Thị Hoa',
		captainEmail: 'hoa.vt@hutech.edu.vn',
		memberCount: 6,
		score: 2280,
		status: 'active',
		registeredAt: new Date('2025-01-19')
	},
	{
		id: '6',
		rank: 6,
		name: 'Stellar Automata',
		captainName: 'Bùi Quốc Khánh',
		captainEmail: 'khanh.bq@neu.edu.vn',
		memberCount: 4,
		score: 2100,
		status: 'active',
		registeredAt: new Date('2025-01-20')
	},
	{
		id: '7',
		rank: 7,
		name: 'TechWave Saigon',
		captainName: 'Ngô Thị Phương',
		captainEmail: 'phuong.nt@hcmut.edu.vn',
		memberCount: 5,
		score: 1950,
		status: 'pending',
		registeredAt: new Date('2025-01-21')
	},
	{
		id: '8',
		rank: 8,
		name: 'Delta Force Robotics',
		captainName: 'Hoàng Văn Nam',
		captainEmail: 'nam.hv@dut.udn.vn',
		memberCount: 3,
		score: 1820,
		status: 'pending',
		registeredAt: new Date('2025-01-22')
	}
];

function createTeamStore() {
	const teams = writable<Team[]>(initialTeams);
	const searchQuery = writable('');

	const filteredTeams = derived([teams, searchQuery], ([$teams, $query]) => {
		if (!$query.trim()) return $teams;
		const q = $query.toLowerCase();
		return $teams.filter(
			(t) =>
				t.name.toLowerCase().includes(q) ||
				t.captainName.toLowerCase().includes(q) ||
				t.captainEmail.toLowerCase().includes(q)
		);
	});

	const stats = derived(teams, ($teams) => ({
		total: $teams.length,
		participants: $teams.reduce((acc, t) => acc + t.memberCount, 0),
		active: $teams.filter((t) => t.status === 'active').length
	}));

	function addTeam(formData: TeamFormData): Team {
		const newTeam: Team = {
			id: crypto.randomUUID(),
			rank: 0,
			name: formData.teamName,
			captainName: formData.captainName,
			captainEmail: formData.captainEmail,
			memberCount: formData.memberCount,
			score: 0,
			status: 'pending',
			registeredAt: new Date()
		};

		teams.update((current) => {
			const updated = [...current, { ...newTeam, rank: current.length + 1 }];
			return updated.map((t, i) => ({ ...t, rank: i + 1 }));
		});

		return newTeam;
	}

	return { teams, filteredTeams, searchQuery, stats, addTeam };
}

export const teamStore = createTeamStore();
