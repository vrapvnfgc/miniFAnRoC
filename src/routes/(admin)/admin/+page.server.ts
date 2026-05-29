import type { PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('session');

	try {
		const res = await api.users.list({
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		return {
			users: res.data?.users || []
		};
	} catch (err) {
		console.error('Admin loader error:', err);
		const apiError = err as { error?: { message?: string } };
		return {
			users: [],
			error: apiError?.error?.message || 'Could not connect to user database service'
		};
	}
};
