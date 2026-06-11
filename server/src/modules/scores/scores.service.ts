import {
	AllianceScoreInput,
	SaveMatchScoreInput,
	AllianceScoreResponse,
	MatchScoreResponse
} from '@shared';
import { AppError } from '../../core/errors';
import { matchesService } from '../matches/matches.service';
import { MatchScoreModel } from './scores.model';

function calculateAllianceTotal(score: AllianceScoreInput): number {
	const tele = Number(score.teleIndependent ?? 0);
	const mult = Number(score.balanceMultiplier ?? 1) || 1;
	const shared = Number(score.sharedScore ?? 0);
	const endgame = Number(score.endgame ?? 0);
	const penalties = Number(score.penalties ?? 0);

	const total = tele * mult + shared + endgame - penalties;
	return Number.isFinite(total) ? total : 0;
}

function buildAllianceScore(score: AllianceScoreInput): AllianceScoreResponse {
	return {
		teleIndependent: score.teleIndependent,
		sharedScore: score.sharedScore,
		penalties: score.penalties,
		endgame: score.endgame,
		balanceMultiplier: score.balanceMultiplier,
		total: calculateAllianceTotal(score)
	};
}

function mapScore(score: any): MatchScoreResponse {
	return {
		id: String(score._id),
		matchId: score.matchId,
		red: score.red,
		blue: score.blue,
		status: score.status,
		submittedAt: score.submittedAt,
		finalizedAt: score.finalizedAt,
		createdAt: score.createdAt,
		updatedAt: score.updatedAt
	};
}

class ScoresService {
	async saveMatchScore(matchId: string, data: SaveMatchScoreInput): Promise<MatchScoreResponse> {
		await matchesService.getMatchById(matchId);

		const existingScore = await MatchScoreModel.findOne({ matchId });

		if (existingScore?.status === 'finalized') {
			throw AppError.conflict('Finalized score cannot be edited', 'SCORE_ALREADY_FINALIZED');
		}

		const sharedScore = data.red.sharedScore;
		const red = buildAllianceScore({ ...data.red, sharedScore });
		const blue = buildAllianceScore({ ...data.blue, sharedScore });
		const status = data.status || 'draft';

		if (existingScore) {
			existingScore.red = red;
			existingScore.blue = blue;
			existingScore.status = status;

			if (status === 'submitted') {
				existingScore.submittedAt = new Date();
			}

			const updatedScore = await existingScore.save();
			return mapScore(updatedScore);
		}

		const score = await MatchScoreModel.create({
			matchId,
			red,
			blue,
			status,
			submittedAt: status === 'submitted' ? new Date() : undefined
		});

		return mapScore(score);
	}

	async getScoreByMatchId(matchId: string): Promise<MatchScoreResponse> {
		const score = await MatchScoreModel.findOne({ matchId });

		if (!score) {
			throw AppError.notFound(`Score for match "${matchId}" could not be found`);
		}

		return mapScore(score);
	}

	async finalizeScore(matchId: string): Promise<MatchScoreResponse> {
		const match = await matchesService.getMatchById(matchId);

		const score = await MatchScoreModel.findOne({ matchId });

		if (!score) {
			throw AppError.notFound(`Score for match "${matchId}" could not be found`);
		}

		score.status = 'finalized';
		score.finalizedAt = new Date();

		await matchesService.updateMatch(matchId, {
			status: 'finished',
			endTime: match.endTime || new Date()
		});

		const finalizedScore = await score.save();

		return mapScore(finalizedScore);
	}

	async getAllScores(): Promise<MatchScoreResponse[]> {
		const scores = await MatchScoreModel.find();
		return scores.map(mapScore);
	}
}

export const scoresService = new ScoresService();
