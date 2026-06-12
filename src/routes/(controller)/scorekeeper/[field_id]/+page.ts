import type { PageLoad } from './$types';
import { api } from '$lib/api';

export const load: PageLoad = async ({ params }) => {
	const fieldId = params.field_id;

	try {
		const teamsRes = await api.teams.getAll();
		return {
			fieldId,
			teams: teamsRes.data?.teams || []
		};
	} catch (e) {
		return { fieldId, teams: [] };
	}
};
