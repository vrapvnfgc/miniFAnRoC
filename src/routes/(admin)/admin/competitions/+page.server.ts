import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { api } from '$lib/api';
import type { CompetitionStatus } from '@shared';

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

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const description = data.get('description');
		const nameEn = data.get('nameEn');
		const nameVi = data.get('nameVi');
		const descriptionEn = data.get('descriptionEn');
		const descriptionVi = data.get('descriptionVi');
		const status = data.get('status');
		const nextCompetitionId = data.get('nextCompetitionId');
		const startDate = data.get('startDate');
		const endDate = data.get('endDate');

		if (!name || !status) {
			return fail(400, { missing: true, type: 'create' });
		}

		try {
			await api.competitions.create({
				name: name.toString(),
				description: description?.toString() || undefined,
				nameEn: nameEn?.toString() || undefined,
				nameVi: nameVi?.toString() || undefined,
				descriptionEn: descriptionEn?.toString() || undefined,
				descriptionVi: descriptionVi?.toString() || undefined,
				status: status as CompetitionStatus,
				nextCompetitionId: nextCompetitionId?.toString() || undefined,
				startDate: startDate ? new Date(startDate.toString()).toISOString() : undefined,
				endDate: endDate ? new Date(endDate.toString()).toISOString() : undefined
			});

			return { success: true, type: 'create' };
		} catch (err) {
			console.error('Create competition error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, {
				success: false,
				error: apiError?.error?.message || 'Failed to create competition',
				type: 'create'
			});
		}
	},

	edit: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const name = data.get('name');
		const description = data.get('description');
		const nameEn = data.get('nameEn');
		const nameVi = data.get('nameVi');
		const descriptionEn = data.get('descriptionEn');
		const descriptionVi = data.get('descriptionVi');
		const status = data.get('status');
		const nextCompetitionId = data.get('nextCompetitionId');
		const startDate = data.get('startDate');
		const endDate = data.get('endDate');

		if (!id || !name || !status) {
			return fail(400, { missing: true, type: 'edit' });
		}

		try {
			await api.competitions.update(id.toString(), {
				name: name.toString(),
				description: description?.toString() || undefined,
				nameEn: nameEn?.toString() || undefined,
				nameVi: nameVi?.toString() || undefined,
				descriptionEn: descriptionEn?.toString() || undefined,
				descriptionVi: descriptionVi?.toString() || undefined,
				status: status as CompetitionStatus,
				nextCompetitionId: nextCompetitionId?.toString() || undefined,
				startDate: startDate ? new Date(startDate.toString()).toISOString() : undefined,
				endDate: endDate ? new Date(endDate.toString()).toISOString() : undefined
			});

			return { success: true, type: 'edit' };
		} catch (err) {
			console.error('Edit competition error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, {
				success: false,
				error: apiError?.error?.message || 'Failed to update competition',
				type: 'edit'
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
			await api.competitions.delete(id.toString());
			return { success: true, type: 'delete' };
		} catch (err) {
			console.error('Delete competition error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, {
				success: false,
				error: apiError?.error?.message || 'Failed to delete competition',
				type: 'delete'
			});
		}
	}
};
