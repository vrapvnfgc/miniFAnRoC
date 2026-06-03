import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { api } from '$lib/api';

export const load: PageServerLoad = async () => {
	try {
		const res = await api.teams.getAll();
		return {
			teams: res.data?.teams || []
		};
	} catch (err) {
		console.error('Teams loader error:', err);
		return {
			teams: [],
			error: 'Could not fetch teams'
		};
	}
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const teamNumber = data.get('teamNumber');
		const name = data.get('name');
		const school = data.get('school');
		const coach = data.get('coach');
		const robotName = data.get('robotName');

		if (!teamNumber || !name || !school) {
			return fail(400, { missing: true, type: 'create' });
		}

		try {
			await api.teams.create({
				teamNumber: teamNumber.toString(),
				name: name.toString(),
				school: school.toString(),
				coach: coach?.toString() || undefined,
				robotName: robotName?.toString() || undefined
			});

			return { success: true, type: 'create' };
		} catch (err) {
			console.error('Create team error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, { 
				success: false, 
				error: apiError?.error?.message || 'Failed to create team',
				type: 'create'
			});
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) {
			return fail(400, { missing: true, type: 'delete' });
		}

		try {
			await api.teams.delete(id.toString());
			return { success: true, type: 'delete' };
		} catch (err) {
			console.error('Delete team error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, { 
				success: false, 
				error: apiError?.error?.message || 'Failed to delete team',
				type: 'delete'
			});
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const teamNumber = data.get('teamNumber');
		const name = data.get('name');
		const school = data.get('school');
		const coach = data.get('coach');
		const robotName = data.get('robotName');

		if (!id || !teamNumber || !name || !school) {
			return fail(400, { missing: true, type: 'update' });
		}

		try {
			await api.teams.update(id.toString(), {
				teamNumber: teamNumber.toString(),
				name: name.toString(),
				school: school.toString(),
				coach: coach?.toString() || undefined,
				robotName: robotName?.toString() || undefined
			});

			return { success: true, type: 'update' };
		} catch (err) {
			console.error('Update team error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, { 
				success: false, 
				error: apiError?.error?.message || 'Failed to update team',
				type: 'update'
			});
		}
	}
};
