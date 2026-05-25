import { BaseService, type ApiResponse } from './index';

export type ScoreStatus = 'draft' | 'submitted' | 'finalized';

export type AllianceScoreInput = {
	teleIndependent: number;
	sharedScore: number;
	penalties: number;
	endgame: number;
	endgameMultiplier: number;
};

export type AllianceScoreResponse = AllianceScoreInput & {
	total: number;
};

export type SaveMatchScore = {
	red: AllianceScoreInput;
	blue: AllianceScoreInput;
	status?: 'draft' | 'submitted';
};

export type MatchScoreResponse = {
	id: string;
	matchId: string;
	red: AllianceScoreResponse;
	blue: AllianceScoreResponse;
	status: ScoreStatus;
	submittedAt?: string;
	finalizedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export class ScoresService extends BaseService {
	async save(matchId: string, data: SaveMatchScore): Promise<ApiResponse<{ score: MatchScoreResponse }>> {
		return this.http.post<ApiResponse<{ score: MatchScoreResponse }>>(
			`/matches/${matchId}/score`,
			data
		);
	}

	async getByMatchId(matchId: string): Promise<ApiResponse<{ score: MatchScoreResponse }>> {
		return this.http.get<ApiResponse<{ score: MatchScoreResponse }>>(
			`/matches/${matchId}/score`
		);
	}

	async finalize(matchId: string): Promise<ApiResponse<{ score: MatchScoreResponse }>> {
		return this.http.post<ApiResponse<{ score: MatchScoreResponse }>>(
			`/matches/${matchId}/score/finalize`
		);
	}
}

export const scoresApi = new ScoresService();
