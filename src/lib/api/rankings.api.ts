import { BaseService, type ApiResponse } from './base';

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

export class RankingsService extends BaseService {
	getAll(includeUnfinalized = false): Promise<ApiResponse<{ rankings: RankingItem[] }>> {
		const query = includeUnfinalized ? '?includeUnfinalized=true' : '';
		return this.http.get<ApiResponse<{ rankings: RankingItem[] }>>(`/rankings${query}`);
	}
}
