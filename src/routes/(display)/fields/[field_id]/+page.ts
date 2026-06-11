import type { PageLoad } from './$types';
import { api } from '$lib/api';

export const load: PageLoad = async ({ params }) => {
	const fieldId = params.field_id;
	
	try {
		const res = await api.rankings.getAll(true); // include unfinalized for live feel maybe? Or just false
		return {
			fieldId,
			rankings: res.data?.rankings || []
		};
	} catch (e) {
		return { fieldId, rankings: [] };
	}
};
