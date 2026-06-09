import type { PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const id = params.id;

        const [competitionRes, teamsRes, matchesRes, fieldsRes, competitionsRes] = await Promise.all([
            api.competitions.getById(id),
            api.teams.getAll(),
            api.matches.getAll(),
            api.fields.getAll(),
            api.competitions.getAll()
        ]);

        const competition = competitionRes.data?.competition || null;
        const allTeams = teamsRes.data?.teams || [];
        const registeredTeams = allTeams.filter((t: any) => (t.competitionIds || []).includes(id));
        const matches = matchesRes.data?.matches || [];
        const competitionMatches = matches.filter((m: any) => m.competitionId === id);
        const fields = fieldsRes.data?.fields || [];
        const competitions = competitionsRes.data?.competitions || [];
        const nextCompetition = competitions.find((c: any) => c.id === competition?.nextCompetitionId) || null;
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
            fields,
            nextCompetition
        };
    } catch (err) {
        console.error('Competition page load error:', err);
        return {
            competition: null,
            teams: [],
            matches: [],
            fields: [],
            nextCompetition: null,
            error: 'Could not load competition'
        };
    }
};
