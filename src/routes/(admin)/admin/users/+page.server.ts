import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
	const users = [
		{ id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'Admin' },
		{ id: '2', name: 'Bob Jones', email: 'bob@example.com', role: 'User' },
		{ id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'User' }
	];

	return {
		users
	};
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const email = data.get('email');
		
		if (!name || !email) {
			return fail(400, { missing: true });
		}

		return { success: true };
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const name = data.get('name');
		const email = data.get('email');
		
		if (!id || !name || !email) {
			return fail(400, { missing: true });
		}

		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		
		if (!id) {
			return fail(400, { missing: true });
		}

		return { success: true };
	}
} satisfies Actions;
