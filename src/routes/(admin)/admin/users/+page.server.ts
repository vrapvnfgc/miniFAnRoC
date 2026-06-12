import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { api } from '$lib/api';

export const load: PageServerLoad = async () => {
	try {
		const res = await api.users.list();
		return {
			users: res.data?.users || []
		};
	} catch (err) {
		console.error('Users loader error:', err);
		return {
			users: [],
			error: 'Could not fetch users'
		};
	}
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		const role = data.get('role')?.toString() as 'USER' | 'ADMIN';

		if (!name || !email || !password) {
			return fail(400, { missing: true, type: 'create' });
		}

		try {
			await api.users.create({
				name,
				email,
				password,
				role: role || 'USER'
			});
			return { success: true, type: 'create' };
		} catch (err) {
			console.error('Create user error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, { 
				success: false, 
				error: apiError?.error?.message || 'Failed to create user',
				type: 'create'
			});
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const name = data.get('name')?.toString();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		const role = data.get('role')?.toString() as 'USER' | 'ADMIN';

		if (!id) {
			return fail(400, { missing: true, type: 'update' });
		}

		try {
			const updateData: any = {};
			if (name) updateData.name = name;
			if (email) updateData.email = email;
			if (password) updateData.password = password;
			if (role) updateData.role = role;

			await api.users.update(id, updateData);
			return { success: true, type: 'update' };
		} catch (err) {
			console.error('Update user error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, { 
				success: false, 
				error: apiError?.error?.message || 'Failed to update user',
				type: 'update'
			});
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) {
			return fail(400, { missing: true, type: 'delete' });
		}

		try {
			await api.users.delete(id);
			return { success: true, type: 'delete' };
		} catch (err) {
			console.error('Delete user error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, { 
				success: false, 
				error: apiError?.error?.message || 'Failed to delete user',
				type: 'delete'
			});
		}
	}
};
