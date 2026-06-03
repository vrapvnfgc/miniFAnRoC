import { writable, derived } from 'svelte/store';

export type MatchPhase = 'qualification' | 'semifinal' | 'final';
export type MatchStatus = 'queued' | 'scheduled' | 'in_progress' | 'finished' | 'terminated';
export type Alliance = 'red' | 'blue';

export interface MatchTeam {
	id: string;
	name: string;
	number: string;
}

export interface MatchScore {
	red: number;
	blue: number;
}

export interface Match {
	id: string;
	matchNumber: number;
	phase: MatchPhase;
	fieldId: string;
	redTeams: MatchTeam[];
	blueTeams: MatchTeam[];
	status: MatchStatus;
	scheduledTime?: string;
	score?: MatchScore;
	winner?: Alliance | 'tie';
}

const initialMatches: Match[] = [
	{
		id: 'm1',
		matchNumber: 1,
		phase: 'qualification',
		fieldId: 'field-1',
		redTeams: [
			{ id: '1', name: 'Quantum Nexus', number: 'T001' },
			{ id: '2', name: 'CyberDragon VN', number: 'T002' }
		],
		blueTeams: [
			{ id: '3', name: 'Iron Phoenix', number: 'T003' },
			{ id: '4', name: 'NeuralStorm', number: 'T004' }
		],
		status: 'finished',
		scheduledTime: '2025-03-15T09:00:00',
		score: { red: 125, blue: 98 },
		winner: 'red'
	},
	{
		id: 'm2',
		matchNumber: 2,
		phase: 'qualification',
		fieldId: 'field-1',
		redTeams: [
			{ id: '5', name: 'RoboViet Elite', number: 'T005' },
			{ id: '6', name: 'Stellar Automata', number: 'T006' }
		],
		blueTeams: [
			{ id: '7', name: 'TechWave Saigon', number: 'T007' },
			{ id: '8', name: 'Delta Force Robotics', number: 'T008' }
		],
		status: 'finished',
		scheduledTime: '2025-03-15T09:30:00',
		score: { red: 87, blue: 110 },
		winner: 'blue'
	},
	{
		id: 'm3',
		matchNumber: 3,
		phase: 'qualification',
		fieldId: 'field-1',
		redTeams: [
			{ id: '1', name: 'Quantum Nexus', number: 'T001' },
			{ id: '5', name: 'RoboViet Elite', number: 'T005' }
		],
		blueTeams: [
			{ id: '6', name: 'Stellar Automata', number: 'T006' },
			{ id: '8', name: 'Delta Force Robotics', number: 'T008' }
		],
		status: 'finished',
		scheduledTime: '2025-03-15T10:00:00',
		score: { red: 140, blue: 95 },
		winner: 'red'
	},
	{
		id: 'm4',
		matchNumber: 4,
		phase: 'qualification',
		fieldId: 'field-1',
		redTeams: [
			{ id: '2', name: 'CyberDragon VN', number: 'T002' },
			{ id: '4', name: 'NeuralStorm', number: 'T004' }
		],
		blueTeams: [
			{ id: '3', name: 'Iron Phoenix', number: 'T003' },
			{ id: '7', name: 'TechWave Saigon', number: 'T007' }
		],
		status: 'in_progress',
		scheduledTime: '2025-03-15T10:30:00'
	},
	{
		id: 'm5',
		matchNumber: 5,
		phase: 'qualification',
		fieldId: 'field-2',
		redTeams: [
			{ id: '3', name: 'Iron Phoenix', number: 'T003' },
			{ id: '5', name: 'RoboViet Elite', number: 'T005' }
		],
		blueTeams: [
			{ id: '1', name: 'Quantum Nexus', number: 'T001' },
			{ id: '6', name: 'Stellar Automata', number: 'T006' }
		],
		status: 'scheduled',
		scheduledTime: '2025-03-15T11:00:00'
	},
	{
		id: 'm6',
		matchNumber: 6,
		phase: 'qualification',
		fieldId: 'field-2',
		redTeams: [
			{ id: '7', name: 'TechWave Saigon', number: 'T007' },
			{ id: '2', name: 'CyberDragon VN', number: 'T002' }
		],
		blueTeams: [
			{ id: '8', name: 'Delta Force Robotics', number: 'T008' },
			{ id: '4', name: 'NeuralStorm', number: 'T004' }
		],
		status: 'scheduled',
		scheduledTime: '2025-03-15T11:30:00'
	},
	{
		id: 'm7',
		matchNumber: 7,
		phase: 'semifinal',
		fieldId: 'field-1',
		redTeams: [
			{ id: '1', name: 'Quantum Nexus', number: 'T001' },
			{ id: '3', name: 'Iron Phoenix', number: 'T003' }
		],
		blueTeams: [
			{ id: '2', name: 'CyberDragon VN', number: 'T002' },
			{ id: '4', name: 'NeuralStorm', number: 'T004' }
		],
		status: 'queued',
		scheduledTime: '2025-04-05T14:00:00'
	},
	{
		id: 'm8',
		matchNumber: 8,
		phase: 'final',
		fieldId: 'field-1',
		redTeams: [
			{ id: '1', name: 'Quantum Nexus', number: 'T001' },
			{ id: '2', name: 'CyberDragon VN', number: 'T002' }
		],
		blueTeams: [
			{ id: '3', name: 'Iron Phoenix', number: 'T003' },
			{ id: '5', name: 'RoboViet Elite', number: 'T005' }
		],
		status: 'queued',
		scheduledTime: '2025-04-20T15:00:00'
	}
];

function createMatchStore() {
	const matches = writable<Match[]>(initialMatches);

	const byStatus = derived(matches, ($matches) => ({
		finished: $matches.filter((m) => m.status === 'finished'),
		live: $matches.filter((m) => m.status === 'in_progress'),
		upcoming: $matches.filter((m) => m.status === 'scheduled' || m.status === 'queued')
	}));

	return { matches, byStatus };
}

export const matchStore = createMatchStore();
