import type { PageLoad } from './$types';
import { api } from '$lib/api';

export const load: PageLoad = async ({ params }) => {
	const fieldId = params.field_id;
	
	let rankings: any[] = [];
	let teams: any[] = [];
	let field: any = null;

	try {
		const rankingsRes = await api.rankings.getAll(true);
		rankings = rankingsRes.data?.rankings || [];
	} catch (e) {
		console.error('Failed to load rankings:', e);
	}

	try {
		const teamsRes = await api.teams.getAll();
		teams = teamsRes.data?.teams || [];
	} catch (e) {
		console.error('Failed to load teams:', e);
	}

	try {
		const fieldRes = await api.fields.getById(fieldId);
		field = fieldRes.data?.field || null;
	} catch (e) {
		console.error('Failed to load field:', e);
	}

	return {
		fieldId,
		field,
		rankings,
		teams
	};
};
