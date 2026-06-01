import type { PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async () => {
	try {
		const [matchesRes, teamsRes, fieldsRes] = await Promise.all([
			api.matches.getAll(),
			api.teams.getAll(),
			api.fields.getAll()
		]);

		const matches = matchesRes.data?.matches || [];
		const teams = teamsRes.data?.teams || [];
		const fields = fieldsRes.data?.fields || [];

		const stats = {
			totalTeams: teams.length,
			totalMatches: matches.length,
			finishedMatches: matches.filter((m: any) => m.status === 'finished').length,
			upcomingMatches: matches.filter((m: any) => m.status !== 'finished').length,
			totalFields: fields.length
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
				totalFields: 0
			},
			error: apiError?.error?.message || 'Could not fetch dashboard data'
		};
	}
};
