import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { api } from '$lib/api';
import type { MatchPhase } from '@shared';

export const load: PageServerLoad = async () => {
	try {
		const [matchesRes, teamsRes, fieldsRes] = await Promise.all([
			api.matches.getAll(),
			api.teams.getAll(),
			api.fields.getAll()
		]);

		return {
			matches: matchesRes.data?.matches || [],
			teams: teamsRes.data?.teams || [],
			fields: fieldsRes.data?.fields || []
		};
	} catch (err) {
		console.error('Matches loader error:', err);
		return {
			matches: [],
			teams: [],
			fields: [],
			error: 'Could not fetch data'
		};
	}
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const matchNumber = data.get('matchNumber');
		const phase = data.get('phase');
		const fieldId = data.get('fieldId');
		const redTeam1 = data.get('redTeam1');
		const redTeam2 = data.get('redTeam2');
		const blueTeam1 = data.get('blueTeam1');
		const blueTeam2 = data.get('blueTeam2');
		const scheduledTime = data.get('scheduledTime');
		const notes = data.get('notes');

		if (!matchNumber || !phase || !fieldId || !redTeam1 || !redTeam2 || !blueTeam1 || !blueTeam2) {
			return fail(400, { missing: true, type: 'create' });
		}

		// Validate that teams are different
		const allTeams = [redTeam1.toString(), redTeam2.toString(), blueTeam1.toString(), blueTeam2.toString()];
		const uniqueTeams = new Set(allTeams);
		if (uniqueTeams.size !== 4) {
			return fail(400, {
				success: false,
				error: 'All teams must be different',
				type: 'create'
			});
		}

		try {
			await api.matches.create({
				matchNumber: parseInt(matchNumber.toString()),
				phase: phase as MatchPhase,
				fieldId: fieldId.toString(),
				redTeamIds: [redTeam1.toString(), redTeam2.toString()],
				blueTeamIds: [blueTeam1.toString(), blueTeam2.toString()],
				status: 'scheduled',
				scheduledTime: scheduledTime ? new Date(scheduledTime.toString()).toISOString() : undefined,
				notes: notes?.toString() || undefined
			});

			return { success: true, type: 'create' };
		} catch (err) {
			console.error('Create match error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, {
				success: false,
				error: apiError?.error?.message || 'Failed to create match',
				type: 'create'
			});
		}
	},

	edit: async ({ request }) => {
		const data = await request.formData();
		const matchId = data.get('matchId');
		const matchNumber = data.get('matchNumber');
		const phase = data.get('phase');
		const fieldId = data.get('fieldId');
		const redTeam1 = data.get('redTeam1');
		const redTeam2 = data.get('redTeam2');
		const blueTeam1 = data.get('blueTeam1');
		const blueTeam2 = data.get('blueTeam2');
		const scheduledTime = data.get('scheduledTime');
		const notes = data.get('notes');

		if (!matchId || !matchNumber || !phase || !fieldId || !redTeam1 || !redTeam2 || !blueTeam1 || !blueTeam2) {
			return fail(400, { missing: true, type: 'edit' });
		}

		// Validate that teams are different
		const allTeams = [redTeam1.toString(), redTeam2.toString(), blueTeam1.toString(), blueTeam2.toString()];
		const uniqueTeams = new Set(allTeams);
		if (uniqueTeams.size !== 4) {
			return fail(400, {
				success: false,
				error: 'All teams must be different',
				type: 'edit'
			});
		}

		try {
			const updateRes = await api.matches.update(matchId.toString(), {
				matchNumber: parseInt(matchNumber.toString()),
				phase: phase as MatchPhase,
				fieldId: fieldId.toString(),
				redTeamIds: [redTeam1.toString(), redTeam2.toString()],
				blueTeamIds: [blueTeam1.toString(), blueTeam2.toString()],
				scheduledTime: scheduledTime ? new Date(scheduledTime.toString()).toISOString() : undefined,
				notes: notes?.toString() || undefined
			});

			console.log('Matches edit action - updateRes:', updateRes);

			return { success: true, type: 'edit' };
		} catch (err) {
			console.error('Edit match error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, {
				success: false,
				error: apiError?.error?.message || 'Failed to update match',
				type: 'edit'
			});
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const matchId = data.get('matchId');

		if (!matchId) {
			return fail(400, { missing: true, type: 'delete' });
		}

		try {
			await api.matches.delete(matchId.toString());
			return { success: true, type: 'delete' };
		} catch (err) {
			console.error('Delete match error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, {
				success: false,
				error: apiError?.error?.message || 'Failed to delete match',
				type: 'delete'
			});
		}
	},

	finishMatch: async ({ request }) => {
		const data = await request.formData();
		const matchId = data.get('matchId');

		// Parse score inputs
		const redTeleIndependent = parseFloat(data.get('redTeleIndependent')?.toString() || '0');
		const redShared = parseFloat(data.get('redShared')?.toString() || '0');
		const redPenalties = parseFloat(data.get('redPenalties')?.toString() || '0');
		const redEndgame = parseFloat(data.get('redEndgame')?.toString() || '0');
		const redEndgameMultiplier = parseFloat(data.get('redEndgameMultiplier')?.toString() || '1');

		const blueTeleIndependent = parseFloat(data.get('blueTeleIndependent')?.toString() || '0');
		const blueShared = parseFloat(data.get('blueShared')?.toString() || '0');
		const bluePenalties = parseFloat(data.get('bluePenalties')?.toString() || '0');
		const blueEndgame = parseFloat(data.get('blueEndgame')?.toString() || '0');
		const blueEndgameMultiplier = parseFloat(data.get('blueEndgameMultiplier')?.toString() || '1');

		if (!matchId) {
			return fail(400, { missing: true, type: 'finishMatch' });
		}

		try {
			// Save the match score
			await api.scores.save(matchId.toString(), {
				red: {
					teleIndependent: redTeleIndependent,
					sharedScore: redShared,
					penalties: redPenalties,
					endgame: redEndgame,
					endgameMultiplier: redEndgameMultiplier
				},
				blue: {
					teleIndependent: blueTeleIndependent,
					sharedScore: blueShared,
					penalties: bluePenalties,
					endgame: blueEndgame,
					endgameMultiplier: blueEndgameMultiplier
				},
				status: 'submitted'
			});

			// Update match status to finished
			await api.matches.update(matchId.toString(), {
				status: 'finished'
			});

			return { success: true, type: 'finishMatch' };
		} catch (err) {
			console.error('Finish match error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, {
				success: false,
				error: apiError?.error?.message || 'Failed to save score and finish match',
				type: 'finishMatch'
			});
		}
	}
};
