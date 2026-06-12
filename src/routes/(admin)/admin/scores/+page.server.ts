import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { api } from '$lib/api';

export const load: PageServerLoad = async () => {
    try {
        const [scoresRes, matchesRes, teamsRes, competitionsRes] = await Promise.all([
            api.scores.getAll(),
            api.matches.getAll(),
            api.teams.getAll(),
            api.competitions.getAll()
        ]);
        
        return {
            scores: scoresRes.data?.scores || [],
            matches: matchesRes.data?.matches || [],
            teams: teamsRes.data?.teams || [],
            competitions: competitionsRes.data?.competitions || []
        };
    } catch (err) {
        console.error('Scores loader error:', err);
        return {
            scores: [],
            matches: [],
            teams: [],
            competitions: [],
            error: 'Could not fetch scores'
        };
    }
};

export const actions: Actions = {
    finalize: async ({ request }) => {
        const data = await request.formData();
        const matchId = data.get('matchId')?.toString();
        
        if (!matchId) {
            return fail(400, { missing: true, type: 'finalize' });
        }
        
        try {
            await api.scores.finalize(matchId);
            return { success: true, type: 'finalize' };
        } catch (err) {
            console.error('Finalize score error:', err);
            const apiError = err as { error?: { message?: string } };
            return fail(400, {
                success: false,
                error: apiError?.error?.message || 'Failed to finalize score',
                type: 'finalize'
            });
        }
    },

    editScore: async ({ request }) => {
        const data = await request.formData();
        const matchId = data.get('matchId')?.toString();
        
        // Parse score inputs
        const redTeleIndependent = parseFloat(data.get('redTeleIndependent')?.toString() || '0');
        const sharedScore = parseFloat(data.get('sharedScore')?.toString() || '0');
        const redPenalties = parseFloat(data.get('redPenalties')?.toString() || '0');
        const redEndgame = parseFloat(data.get('redEndgame')?.toString() || '0');
        const redBalanceMultiplier = parseFloat(data.get('redBalanceMultiplier')?.toString() || '1');

        const blueTeleIndependent = parseFloat(data.get('blueTeleIndependent')?.toString() || '0');
        const bluePenalties = parseFloat(data.get('bluePenalties')?.toString() || '0');
        const blueEndgame = parseFloat(data.get('blueEndgame')?.toString() || '0');
        const blueBalanceMultiplier = parseFloat(data.get('blueBalanceMultiplier')?.toString() || '1');
        
        const status = data.get('status')?.toString() as 'draft' | 'submitted';

        if (!matchId) {
            return fail(400, { missing: true, type: 'editScore' });
        }

        try {
            await api.scores.save(matchId, {
                red: {
                    teleIndependent: redTeleIndependent,
                    sharedScore,
                    penalties: redPenalties,
                    endgame: redEndgame,
                    balanceMultiplier: redBalanceMultiplier
                },
                blue: {
                    teleIndependent: blueTeleIndependent,
                    sharedScore,
                    penalties: bluePenalties,
                    endgame: blueEndgame,
                    balanceMultiplier: blueBalanceMultiplier
                },
                status: status || 'submitted'
            });

            return { success: true, type: 'editScore' };
        } catch (err) {
            console.error('Edit score error:', err);
            const apiError = err as { error?: { message?: string } };
            return fail(400, {
                success: false,
                error: apiError?.error?.message || 'Failed to edit score',
                type: 'editScore'
            });
        }
    }
};
