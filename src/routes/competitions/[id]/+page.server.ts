import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { api } from '$lib/api';
import type { MatchPhase } from '@shared';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const id = params.id;

        const [competitionRes, teamsRes, matchesRes, fieldsRes] = await Promise.all([
            api.competitions.getById(id),
            api.teams.getAll(),
            api.matches.getAll(),
            api.fields.getAll()
        ]);

        const competition = competitionRes.data?.competition || null;
        const allTeams = teamsRes.data?.teams || [];
        const registeredTeams = allTeams.filter((t: any) => (t.competitionIds || []).includes(id));
        const availableTeams = allTeams.filter((t: any) => !(t.competitionIds || []).includes(id));
        const matches = matchesRes.data?.matches || [];
        const competitionMatches = matches.filter((m: any) => m.competitionId === id);
        const fields = fieldsRes.data?.fields || [];

        return {
            competition,
            teams: registeredTeams,
            availableTeams,
            matches: competitionMatches,
            fields
        };
    } catch (err) {
        console.error('Competition page load error:', err);
        return {
            competition: null,
            teams: [],
            availableTeams: [],
            matches: [],
            fields: [],
            error: 'Could not load competition'
        };
    }
};

export const actions: Actions = {
    register: async ({ request, params }) => {
        const data = await request.formData();
        const teamId = data.get('teamId');

        if (!teamId) {
            return fail(400, { missing: true, type: 'register' });
        }

        const compId = params.id;

        try {
            const teamRes = await api.teams.getById(teamId.toString());
            const team = teamRes.data?.team;

            if (!team) {
                return fail(400, { success: false, error: 'Team not found', type: 'register' });
            }

            const currentCompetitionIds = team.competitionIds || [];
            if (currentCompetitionIds.includes(compId)) {
                return { success: true, type: 'register' };
            }

            const updated = [...currentCompetitionIds, compId];

            await api.teams.update(teamId.toString(), { competitionIds: updated });

            return { success: true, type: 'register' };
        } catch (err) {
            console.error('Register team error:', err);
            const apiError = err as { error?: { message?: string } };
            return fail(400, {
                success: false,
                error: apiError?.error?.message || 'Failed to register team',
                type: 'register'
            });
        }
    },

    create: async ({ request, params }) => {
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

        // Validate teams are distinct
        const allTeams = [redTeam1.toString(), redTeam2.toString(), blueTeam1.toString(), blueTeam2.toString()];
        const uniqueTeams = new Set(allTeams);
        if (uniqueTeams.size !== 4) {
            return fail(400, { success: false, error: 'All teams must be different', type: 'create' });
        }

        try {
            const compId = params.id;

            await api.matches.create({
                matchNumber: parseInt(matchNumber.toString()),
                phase: phase as MatchPhase,
                fieldId: fieldId.toString(),
                competitionId: compId,
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
    }
};
