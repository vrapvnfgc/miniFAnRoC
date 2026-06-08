import type { PageServerLoad } from './$types';
import { api } from '$lib/api';

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
        const matches = matchesRes.data?.matches || [];
        const competitionMatches = matches.filter((m: any) => m.competitionId === id);
        const fields = fieldsRes.data?.fields || [];
        // load rankings for the competition (server-side)
        let rankings: any[] = [];
        try {
            // include unfinalized scores for debugging/preview in the public page
            const r = await api.competitions.getRankings(id, true);
            rankings = r.data?.rankings || [];
        } catch (err) {
            console.error('Failed to load competition rankings in server load:', err);
            rankings = [];
        }

        return {
            competition,
            teams: registeredTeams,
            matches: competitionMatches,
            rankings,
            fields
        };
    } catch (err) {
        console.error('Competition page load error:', err);
        return {
            competition: null,
            teams: [],
            matches: [],
            fields: [],
            error: 'Could not load competition'
        };
    }
};
