import type { PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async () => {
	try {
		const [matchesRes, teamsRes, fieldsRes, competitionsRes] = await Promise.all([
			api.matches.getAll(),
			api.teams.getAll(),
			api.fields.getAll(),
			api.competitions.getAll()
		]);

		const matches = matchesRes.data?.matches || [];
		const teams = teamsRes.data?.teams || [];
		const fields = fieldsRes.data?.fields || [];
		const competitions = competitionsRes.data?.competitions || [];

		const stats = {
			totalTeams: teams.length,
			totalMatches: matches.length,
			finishedMatches: matches.filter((m: any) => m.status === 'finished').length,
			upcomingMatches: matches.filter((m: any) => m.status !== 'finished').length,
			totalFields: fields.length,
			totalCompetitions: competitions.length,
			upcomingCompetitions: competitions.filter((c: any) => c.status === 'upcoming').length,
			activeCompetitions: competitions.filter((c: any) => c.status === 'active').length
		};

		return { stats };
	} catch (err) {
		console.error('Admin loader error:', err);
		const apiError = err as { error?: { message?: string } };
		return {
			stats: {
				totalTeams: 0,
				totalMatches: 0,
				finishedMatches: 0,
				upcomingMatches: 0,
				totalFields: 0,
				totalCompetitions: 0,
				upcomingCompetitions: 0,
				activeCompetitions: 0
			},
			error: apiError?.error?.message || 'Could not fetch dashboard data'
		};
	}
};
