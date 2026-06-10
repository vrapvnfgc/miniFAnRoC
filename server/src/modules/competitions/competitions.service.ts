import { CreateCompetition, UpdateCompetition, CompetitionResponse } from '@shared';
import { AppError } from '../../core/errors';
import { CompetitionModel } from './competitions.model';
import { rankingsService } from '../rankings/rankings.service';
import { MatchModel } from '../matches/matches.model';
import { MatchScoreModel } from '../scores/scores.model';
import { TeamModel } from '../teams/teams.model';

function mapCompetition(comp: any): CompetitionResponse {
	return {
		id: String(comp._id),
		name: comp.name,
		description: comp.description,
		nameEn: comp.nameEn,
		nameVi: comp.nameVi,
		descriptionEn: comp.descriptionEn,
		descriptionVi: comp.descriptionVi,
		status: comp.status,
		nextCompetitionId: comp.nextCompetitionId,
		startDate: comp.startDate,
		endDate: comp.endDate,
		createdAt: comp.createdAt,
		updatedAt: comp.updatedAt
	};
}

class CompetitionsService {
	async createCompetition(data: CreateCompetition): Promise<CompetitionResponse> {
		const existing = await CompetitionModel.findOne({ name: data.name });

		if (existing) {
			throw AppError.conflict(
				`Competition name "${data.name}" already exists`,
				'COMPETITION_NAME_ALREADY_EXISTS'
			);
		}

		try {
			const comp = await CompetitionModel.create(data);
			return mapCompetition(comp);
		} catch (error: any) {
			if (error.code === 11000) {
				throw AppError.conflict(
					`Competition name "${data.name}" already exists`,
					'COMPETITION_NAME_ALREADY_EXISTS'
				);
			}
			throw error;
		}
	}

	async getAllCompetitions(): Promise<CompetitionResponse[]> {
		const comps = await CompetitionModel.find().sort({ createdAt: -1 });
		return comps.map(mapCompetition);
	}

	async getCompetitionById(id: string): Promise<CompetitionResponse> {
		const comp = await CompetitionModel.findById(id);

		if (!comp) {
			throw AppError.notFound(`Competition with ID "${id}" could not be found`);
		}

		return mapCompetition(comp);
	}

	async updateCompetition(id: string, data: UpdateCompetition): Promise<CompetitionResponse> {
		const current = await CompetitionModel.findById(id);

		if (!current) {
			throw AppError.notFound(`Competition with ID "${id}" could not be found`);
		}

		if (data.name) {
			const existing = await CompetitionModel.findOne({
				name: data.name,
				_id: { $ne: id }
			});

			if (existing) {
				throw AppError.conflict(
					`Competition name "${data.name}" already exists`,
					'COMPETITION_NAME_ALREADY_EXISTS'
				);
			}
		}

		Object.assign(current, data);

		const updated = await current.save();

		return mapCompetition(updated);
	}

	async deleteCompetition(id: string): Promise<void> {
		const comp = await CompetitionModel.findByIdAndDelete(id);

		if (!comp) {
			throw AppError.notFound(`Competition with ID "${id}" could not be found`);
		}
	}

	async getAwardReport(competitionId: string, includeUnfinalized = false) {
		await this.ensureCompetitionExists(competitionId);

		const rankings = await rankingsService.getRankingsForCompetition(
			competitionId,
			includeUnfinalized
		);

		const awardKeys = [
			'fanroc_excellence',
			'outstanding',
			'innovation',
			'rising_star'
		] as const;

		return {
			competitionId,
			generatedAt: new Date(),
			awards: awardKeys.map((awardKey, index) => ({
				awardKey,
				ranking: rankings[index] || null
			}))
		};
	}

	async getAdvanceReport(competitionId: string, includeUnfinalized = false) {
		const competition = await this.ensureCompetitionExists(competitionId);

		if (!competition.nextCompetitionId) {
			return {
				competitionId,
				nextCompetitionId: null,
				generatedAt: new Date(),
				alliances: []
			};
		}

		const matches = await MatchModel.find({
			competitionId,
			status: 'finished',
			phase: 'playoff'
		});

		const matchIds = matches.map((match) => String(match._id));
		const scoreFilter = includeUnfinalized
			? { status: { $in: ['submitted', 'finalized'] }, matchId: { $in: matchIds } }
			: { status: 'finalized', matchId: { $in: matchIds } };
		const scores = matchIds.length ? await MatchScoreModel.find(scoreFilter) : [];
		const scoreMap = new Map(scores.map((score) => [String(score.matchId), score]));

		const allianceMap = new Map<
			string,
			{
				teamIds: string[];
				matchesPlayed: number;
				totalScore: number;
				highestScore: number;
			}
		>();

		for (const match of matches) {
			const score = scoreMap.get(String(match._id));
			if (!score) continue;

			for (const entry of [
				{ teamIds: match.redTeamIds || [], score: this.computeAllianceTotal(score.red) },
				{ teamIds: match.blueTeamIds || [], score: this.computeAllianceTotal(score.blue) }
			]) {
				const key = this.allianceKey(entry.teamIds);
				const current =
					allianceMap.get(key) ||
					{
						teamIds: [...entry.teamIds].sort(),
						matchesPlayed: 0,
						totalScore: 0,
						highestScore: 0
					};

				current.matchesPlayed += 1;
				current.totalScore += entry.score;
				current.highestScore = Math.max(current.highestScore, entry.score);
				allianceMap.set(key, current);
			}
		}

		const allTeamIds = Array.from(
			new Set(Array.from(allianceMap.values()).flatMap((alliance) => alliance.teamIds))
		);
		const teams = allTeamIds.length ? await TeamModel.find({ _id: { $in: allTeamIds } }) : [];
		const teamMap = new Map(
			teams.map((team) => [
				String(team._id),
				{ teamId: String(team._id), teamNumber: team.teamNumber, teamName: team.name }
			])
		);

		const alliances = Array.from(allianceMap.values())
			.map((alliance) => ({
				...alliance,
				teams: alliance.teamIds.map((teamId) => teamMap.get(teamId) || { teamId }),
				rankingScore: alliance.totalScore,
				averageScore: alliance.matchesPlayed > 0 ? alliance.totalScore / alliance.matchesPlayed : 0
			}))
			.sort((a, b) => {
				if (b.rankingScore !== a.rankingScore) return b.rankingScore - a.rankingScore;
				if (b.highestScore !== a.highestScore) return b.highestScore - a.highestScore;
				return this.allianceKey(a.teamIds).localeCompare(this.allianceKey(b.teamIds));
			})
			.map((alliance, index) => ({
				...alliance,
				rank: index + 1,
				status: index < 4 ? 'advanced' : 'reserve'
			}));

		return {
			competitionId,
			nextCompetitionId: competition.nextCompetitionId,
			generatedAt: new Date(),
			alliances
		};
	}

	private async ensureCompetitionExists(id: string) {
		const competition = await CompetitionModel.findById(id);

		if (!competition) {
			throw AppError.notFound(`Competition with ID "${id}" could not be found`);
		}

		return competition;
	}

	private allianceKey(teamIds: string[]) {
		return [...teamIds].sort().join('|');
	}

	private computeAllianceTotal(alliance: any): number {
		if (!alliance) return 0;
		const explicitTotal = Number(alliance.total);
		if (Number.isFinite(explicitTotal)) return explicitTotal;

		const tele = Number(alliance.teleIndependent ?? 0);
		const shared = Number(alliance.sharedScore ?? 0);
		const penalties = Number(alliance.penalties ?? 0);
		const endgame = Number(alliance.endgame ?? 0);
		const multiplier = Number(alliance.endgameMultiplier ?? 1) || 1;
		const total = (tele + shared - penalties + endgame) * multiplier;
		return Number.isFinite(total) ? total : 0;
	}
}

export const competitionsService = new CompetitionsService();
