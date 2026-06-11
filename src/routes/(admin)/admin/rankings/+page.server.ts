import type { PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async ({ url }) => {
    try {
        const includeUnfinalized = url.searchParams.get('includeUnfinalized') === 'true';
        const res = await api.rankings.getAll(includeUnfinalized);
        
        return {
            rankings: res.data?.rankings || [],
            includeUnfinalized
        };
    } catch (err) {
        console.error('Rankings loader error:', err);
        return {
            rankings: [],
            includeUnfinalized: false,
            error: 'Could not fetch rankings'
        };
    }
};
