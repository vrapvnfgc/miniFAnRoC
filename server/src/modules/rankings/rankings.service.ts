import { RankingItem } from '@shared';
import { TeamModel } from '../teams/teams.model';
import { MatchModel } from '../matches/matches.model';
import { MatchScoreModel } from '../scores/scores.model';

class RankingsService {
	async getRankings(includeUnfinalized = false): Promise<RankingItem[]> {
		const teams = await TeamModel.find().sort({ teamNumber: 1 });

		const rankingMap = new Map<string, RankingItem>();

		for (const team of teams) {
			const teamId = String(team._id);

			rankingMap.set(teamId, {
				rank: 0,
				teamId,
				teamNumber: team.teamNumber,
				teamName: team.name,
				rankingScore: 0,
				highestMatchScore: 0,
				bonusPoint: 0,
				matchesPlayed: 0,
				reason: ''
			});
		}

		const scoreFilter = includeUnfinalized
			? { status: { $in: ['submitted', 'finalized'] } }
			: { status: 'finalized' };

		const scores = await MatchScoreModel.find(scoreFilter);
		const matchIds = scores.map((score) => String(score.matchId));

		const matches = matchIds.length > 0 ? await MatchModel.find({ _id: { $in: matchIds } }) : [];

		const matchMap = new Map(matches.map((match) => [String(match._id), match]));

		for (const score of scores) {
			const match = matchMap.get(String(score.matchId));

			if (!match) {
				continue;
			}

			const redScore = this.computeAllianceTotal(score.red);
			const blueScore = this.computeAllianceTotal(score.blue);

			for (const teamId of match.redTeamIds || []) {
				this.applyMatchScore(rankingMap.get(String(teamId)), redScore);
			}

			for (const teamId of match.blueTeamIds || []) {
				this.applyMatchScore(rankingMap.get(String(teamId)), blueScore);
			}
		}

		const rankings = Array.from(rankingMap.values()).sort((a, b) => {
			if (b.rankingScore !== a.rankingScore) {
				return b.rankingScore - a.rankingScore;
			}

			if (b.highestMatchScore !== a.highestMatchScore) {
				return b.highestMatchScore - a.highestMatchScore;
			}

			if (b.bonusPoint !== a.bonusPoint) {
				return b.bonusPoint - a.bonusPoint;
			}

			return a.teamNumber.localeCompare(b.teamNumber);
		});

		return rankings.map((ranking, index, arr) => ({
			...ranking,
			rank: index + 1
		}));
	}

	async getRankingsForCompetition(competitionId: string, includeUnfinalized = false): Promise<RankingItem[]> {
		// only consider matches that have finished in this competition
		const matches = await MatchModel.find({ competitionId, status: 'finished' });
		const matchIds = matches.map((m) => String(m._id));

		// Gather teams: only teams registered for this competition
		const registeredTeams = await TeamModel.find({ competitionIds: competitionId }).sort({ teamNumber: 1 });
		const teams = registeredTeams;

		const rankingMap = new Map<string, RankingItem>();

		for (const team of teams) {
			const teamId = String(team._id);

			rankingMap.set(teamId, {
				rank: 0,
				teamId,
				teamNumber: team.teamNumber,
				teamName: team.name,
				rankingScore: 0,
				highestMatchScore: 0,
				bonusPoint: 0,
				matchesPlayed: 0,
				reason: ''
			});
		}

		// Do NOT include teams that are not registered for the competition.

		if (matchIds.length === 0) {
			const rankingsEmpty = Array.from(rankingMap.values()).sort((a, b) => a.teamNumber.localeCompare(b.teamNumber));
			return rankingsEmpty.map((r, i) => ({ ...r, rank: i + 1 }));
		}

		const scoreFilter = includeUnfinalized
			? { status: { $in: ['submitted', 'finalized'] }, matchId: { $in: matchIds } }
			: { status: 'finalized', matchId: { $in: matchIds } };

		const scores = await MatchScoreModel.find(scoreFilter);
		const matchMap = new Map(matches.map((match) => [String(match._id), match]));

		for (const score of scores) {
			const match = matchMap.get(String(score.matchId));

			if (!match) continue;

			const redScore = this.computeAllianceTotal(score.red);
			const blueScore = this.computeAllianceTotal(score.blue);

			for (const teamId of match.redTeamIds || []) {
				this.applyMatchScore(rankingMap.get(String(teamId)), redScore);
			}

			for (const teamId of match.blueTeamIds || []) {
				this.applyMatchScore(rankingMap.get(String(teamId)), blueScore);
			}
		}

		const rankings = Array.from(rankingMap.values()).sort((a, b) => {
			if (b.rankingScore !== a.rankingScore) {
				return b.rankingScore - a.rankingScore;
			}

			if (b.highestMatchScore !== a.highestMatchScore) {
				return b.highestMatchScore - a.highestMatchScore;
			}

			if (b.bonusPoint !== a.bonusPoint) {
				return b.bonusPoint - a.bonusPoint;
			}

			return a.teamNumber.localeCompare(b.teamNumber);
		});

		return rankings.map((ranking, index) => ({
			...ranking,
			rank: index + 1
		}));
	}

	private applyMatchScore(ranking: RankingItem | undefined, matchScore: number) {
		if (!ranking) {
			return;
		}

		ranking.matchesPlayed += 1;
		ranking.rankingScore += Number(matchScore || 0);

		if (matchScore > ranking.highestMatchScore) {
			ranking.highestMatchScore = matchScore;
		}

		ranking.bonusPoint += 0;
	}

	private computeAllianceTotal(alliance: any): number {
		if (!alliance) return 0;
		const tele = Number(alliance.teleIndependent ?? 0);
		const shared = Number(alliance.sharedScore ?? 0);
		const penalties = Number(alliance.penalties ?? 0);
		const endgame = Number(alliance.endgame ?? 0);
		const mult = Number(alliance.endgameMultiplier ?? 1) || 1;
		const total = (tele + shared - penalties + endgame) * mult;
		if (Number.isFinite(total)) return total;
		// fallback to explicit total field if present (allow numeric string)
		if (alliance.total != null) {
			const t = Number(alliance.total);
			if (Number.isFinite(t)) return t;
		}
		return 0;
	}
}

export const rankingsService = new RankingsService();
