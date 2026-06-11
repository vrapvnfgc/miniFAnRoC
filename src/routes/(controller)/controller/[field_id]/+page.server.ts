import type { PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async ({ params }) => {
	const fieldId = params.field_id;
	try {
		const matchesRes = await api.matches.getAll();
		const matches = matchesRes.data?.matches?.filter(m => m.fieldId === fieldId) || [];
		
		const fieldRes = await api.fields.getById(fieldId);
		const field = fieldRes.data?.field;

		return {
			fieldId,
			field,
			matches: matches.sort((a, b) => a.matchNumber - b.matchNumber)
		};
	} catch (e) {
		console.error(e);
		return { fieldId, field: null, matches: [] };
	}
};
