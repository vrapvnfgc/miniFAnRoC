import { TeamModel } from '../teams/teams.model';
import { MatchModel } from '../matches/matches.model';
import { MatchScoreModel } from '../scores/scores.model';

export type RankingItem = {
	rank: number;
	teamId: string;
	teamNumber: string;
	teamName: string;
	rankingScore: number;
	highestMatchScore: number;
	bonusPoint: number;
	matchesPlayed: number;
	reason: string;
};

class RankingsService {
	async getRankings(includeUnfinalized = false): Promise<RankingItem[]> {
		const teams = await TeamModel.find().sort({ teamNumber: 1 });

		const rankingMap = new Map<string, RankingItem>();

		for (const team of teams) {
			rankingMap.set(team._id, {
				rank: 0,
				teamId: team._id,
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

		const matchIds = scores.map((score) => score.matchId);

		const matches = await MatchModel.find({
			_id: { $in: matchIds }
		});

		const matchMap = new Map(matches.map((match) => [match._id, match]));

		for (const score of scores) {
			const match = matchMap.get(score.matchId);

			if (!match) {
				continue;
			}

			const redScore = score.red.total;
			const blueScore = score.blue.total;

			for (const teamId of match.redTeamIds) {
				this.applyMatchScore(rankingMap.get(teamId), redScore);
			}

			for (const teamId of match.blueTeamIds) {
				this.applyMatchScore(rankingMap.get(teamId), blueScore);
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
			rank: index + 1,
		}));
	}

	private applyMatchScore(ranking: RankingItem | undefined, matchScore: number) {
		if (!ranking) {
			return;
		}

		ranking.matchesPlayed += 1;
		ranking.rankingScore += matchScore;

		if (matchScore > ranking.highestMatchScore) {
			ranking.highestMatchScore = matchScore;
		}

		// Tạm thời bonusPoint = 0.
		// Sau này có đề chính thức thì sửa ở đây.
		ranking.bonusPoint += 0;
	}
}

export const rankingsService = new RankingsService();