import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { api } from '$lib/api';

export const load: PageServerLoad = async () => {
	try {
		const [teamsRes, competitionsRes] = await Promise.all([api.teams.getAll(), api.competitions.getAll()]);
		return {
			teams: teamsRes.data?.teams || [],
			competitions: competitionsRes.data?.competitions || []
		};
	} catch (err) {
		console.error('Teams loader error:', err);
		return {
			teams: [],
			competitions: [],
			error: 'Could not fetch teams'
		};
	}
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const teamNumber = data.get('teamNumber')?.toString();
		const name = data.get('name')?.toString();
		const school = data.get('school')?.toString();
		const coach = data.get('coach')?.toString();
		const robotName = data.get('robotName')?.toString();
		
		const location = data.get('location')?.toString();
		const representativeEmail = data.get('representativeEmail')?.toString();
		const representativePhone = data.get('representativePhone')?.toString();
		const teacherName = data.get('teacherName')?.toString();
		const teacherEmail = data.get('teacherEmail')?.toString();
		const teacherPhone = data.get('teacherPhone')?.toString();
		
		let members: string[] | undefined = undefined;
		let memberDetails: any[] | undefined = undefined;

		try {
			const membersStr = data.get('members')?.toString();
			if (membersStr) members = JSON.parse(membersStr);
			
			const memberDetailsStr = data.get('memberDetails')?.toString();
			if (memberDetailsStr) memberDetails = JSON.parse(memberDetailsStr);
		} catch(e) {}

		if (!teamNumber || !name || !school) {
			return fail(400, { missing: true, type: 'create' });
		}

		try {
			const competitionIds = data.getAll('competitionIds') as string[];
			await api.teams.create({
				teamNumber,
				name,
				school,
				coach: coach || undefined,
				robotName: robotName || undefined,
				location: location || undefined,
				representativeEmail: representativeEmail || undefined,
				representativePhone: representativePhone || undefined,
				teacherName: teacherName || undefined,
				teacherEmail: teacherEmail || undefined,
				teacherPhone: teacherPhone || undefined,
				members,
				memberDetails,
				competitionIds: competitionIds.map((c) => c.toString())
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
		const teamNumber = data.get('teamNumber')?.toString();
		const name = data.get('name')?.toString();
		const school = data.get('school')?.toString();
		const coach = data.get('coach')?.toString();
		const robotName = data.get('robotName')?.toString();

		const location = data.get('location')?.toString();
		const representativeEmail = data.get('representativeEmail')?.toString();
		const representativePhone = data.get('representativePhone')?.toString();
		const teacherName = data.get('teacherName')?.toString();
		const teacherEmail = data.get('teacherEmail')?.toString();
		const teacherPhone = data.get('teacherPhone')?.toString();
		
		let members: string[] | undefined = undefined;
		let memberDetails: any[] | undefined = undefined;

		try {
			const membersStr = data.get('members')?.toString();
			if (membersStr) members = JSON.parse(membersStr);
			
			const memberDetailsStr = data.get('memberDetails')?.toString();
			if (memberDetailsStr) memberDetails = JSON.parse(memberDetailsStr);
		} catch(e) {}

		if (!id || !teamNumber || !name || !school) {
			return fail(400, { missing: true, type: 'update' });
		}

		try {
			const competitionIds = data.getAll('competitionIds') as string[];
			await api.teams.update(id.toString(), {
				teamNumber,
				name,
				school,
				coach: coach || undefined,
				robotName: robotName || undefined,
				location: location || undefined,
				representativeEmail: representativeEmail || undefined,
				representativePhone: representativePhone || undefined,
				teacherName: teacherName || undefined,
				teacherEmail: teacherEmail || undefined,
				teacherPhone: teacherPhone || undefined,
				members,
				memberDetails,
				competitionIds: competitionIds.map((c) => c.toString())
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
