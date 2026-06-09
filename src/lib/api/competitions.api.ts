import { BaseService, type ApiResponse } from './base';
import type { RankingItem } from './rankings.api';

export type CompetitionStatus = 'upcoming' | 'active' | 'completed';

export type CompetitionResponse = {
	id: string;
	name: string;
	description?: string;
	nameEn?: string;
	nameVi?: string;
	descriptionEn?: string;
	descriptionVi?: string;
	status: CompetitionStatus;
	nextCompetitionId?: string;
	startDate?: string;
	endDate?: string;
	createdAt: string;
	updatedAt: string;
};

export type CreateCompetition = {
	name: string;
	description?: string;
	nameEn?: string;
	nameVi?: string;
	descriptionEn?: string;
	descriptionVi?: string;
	status?: CompetitionStatus;
	nextCompetitionId?: string;
	startDate?: string;
	endDate?: string;
};

export type UpdateCompetition = Partial<CreateCompetition>;

export class CompetitionsService extends BaseService {
	getAll(): Promise<ApiResponse<{ competitions: CompetitionResponse[] }>> {
		return this.http.get<ApiResponse<{ competitions: CompetitionResponse[] }>>('/competitions');
	}

	getById(id: string): Promise<ApiResponse<{ competition: CompetitionResponse }>> {
		return this.http.get<ApiResponse<{ competition: CompetitionResponse }>>(`/competitions/${id}`);
	}

	getRankings(id: string, includeUnfinalized = false): Promise<ApiResponse<{ rankings: RankingItem[] }>> {
		const query = includeUnfinalized ? '?includeUnfinalized=true' : '';
		return this.http.get<ApiResponse<{ rankings: RankingItem[] }>>(`/competitions/${id}/rankings${query}`);
	}

	create(data: CreateCompetition): Promise<ApiResponse<{ competition: CompetitionResponse }>> {
		return this.http.post<ApiResponse<{ competition: CompetitionResponse }>>('/competitions', data);
	}

	update(id: string, data: UpdateCompetition): Promise<ApiResponse<{ competition: CompetitionResponse }>> {
		return this.http.patch<ApiResponse<{ competition: CompetitionResponse }>>(`/competitions/${id}`, data);
	}

	delete(id: string): Promise<void> {
		return this.http.delete<void>(`/competitions/${id}`);
	}
}
