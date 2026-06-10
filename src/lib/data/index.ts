export interface TimelineEvent {
	id: string;
	titleKey: string;
	descriptionKey: string;
	date: string;
	status: 'done' | 'current' | 'upcoming';
	icon: string;
}

export interface Sponsor {
	id: string;
	name: string;
	logo: string;
	tier: 'platinum' | 'gold' | 'silver';
	url: string;
}

export interface Stat {
	key: string;
	value: string;
	suffix?: string;
	color: string;
}

export const timelineEvents: TimelineEvent[] = [
	{
		id: '1',
		titleKey: 'timeline.events.registration.title',
		descriptionKey: 'timeline.events.registration.description',
		date: '15/01/2025',
		status: 'done',
		icon: 'rocket'
	},
	{
		id: '2',
		titleKey: 'timeline.events.deadline.title',
		descriptionKey: 'timeline.events.deadline.description',
		date: '28/02/2025',
		status: 'done',
		icon: 'clock'
	},
	{
		id: '3',
		titleKey: 'timeline.events.qualifying.title',
		descriptionKey: 'timeline.events.qualifying.description',
		date: '15/03/2025',
		status: 'current',
		icon: 'zap'
	},
	{
		id: '4',
		titleKey: 'timeline.events.semifinals.title',
		descriptionKey: 'timeline.events.semifinals.description',
		date: '05/04/2025',
		status: 'upcoming',
		icon: 'trophy'
	},
	{
		id: '5',
		titleKey: 'timeline.events.finals.title',
		descriptionKey: 'timeline.events.finals.description',
		date: '20/04/2025',
		status: 'upcoming',
		icon: 'star'
	}
];

export const sponsors: Sponsor[] = [
	{
		id: '1',
		name: 'FPT University',
		logo: 'FPT',
		tier: 'platinum',
		url: 'https://fpt.edu.vn'
	},
	{
		id: '2',
		name: 'VinAI Research',
		logo: 'VinAI',
		tier: 'platinum',
		url: 'https://vinai.io'
	},
	{
		id: '3',
		name: 'ViettelAI',
		logo: 'Viettel',
		tier: 'gold',
		url: 'https://viettel.com.vn'
	},
	{
		id: '4',
		name: 'VNPT Technology',
		logo: 'VNPT',
		tier: 'gold',
		url: 'https://vnpt.vn'
	},
	{
		id: '5',
		name: 'Bosch Vietnam',
		logo: 'Bosch',
		tier: 'gold',
		url: 'https://bosch.com.vn'
	},
	{
		id: '6',
		name: 'Siemens Vietnam',
		logo: 'Siemens',
		tier: 'silver',
		url: 'https://siemens.com'
	},
	{
		id: '7',
		name: 'Rockwell',
		logo: 'Rockwell',
		tier: 'silver',
		url: 'https://rockwellautomation.com'
	},
	{
		id: '8',
		name: 'ABB Vietnam',
		logo: 'ABB',
		tier: 'silver',
		url: 'https://abb.com'
	}
];

export const heroStats: Stat[] = [
	{ key: 'stats.teams', value: '32', color: 'text-cyber-400' },
	{ key: 'stats.participants', value: '180', color: 'text-violet-400' },
	{ key: 'stats.provinces', value: '12', color: 'text-cyan-400' },
	{ key: 'stats.prize_pool', value: '115M', suffix: 'VNĐ', color: 'text-amber-400' }
];
