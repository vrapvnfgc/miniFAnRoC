import type { PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async ({ params }) => {
	const fieldId = params.field_id;
	try {
		const [matchesRes, fieldRes, teamsRes] = await Promise.all([
			api.matches.getAll(),
			api.fields.getById(fieldId),
			api.teams.getAll()
		]);
		const matches = matchesRes.data?.matches?.filter(m => m.fieldId === fieldId) || [];
		const field = fieldRes.data?.field;
		const teams = teamsRes.data?.teams || [];

		return {
			fieldId,
			field,
			teams,
			matches: matches.sort((a, b) => a.matchNumber - b.matchNumber)
		};
	} catch (e) {
		console.error(e);
		return { fieldId, field: null, teams: [], matches: [] };
	}
};
