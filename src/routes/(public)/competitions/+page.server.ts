import type { PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async () => {
    try {
        const res = await api.competitions.getAll();
        return {
            competitions: res.data?.competitions || []
        };
    } catch (err) {
        console.error('Competitions loader error:', err);
        return {
            competitions: [],
            error: 'Could not fetch competitions'
        };
    }
};
