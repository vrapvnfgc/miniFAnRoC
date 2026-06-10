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

export type AwardReportItem = {
	awardKey: 'fanroc_excellence' | 'outstanding' | 'innovation' | 'rising_star';
	ranking: RankingItem | null;
};

export type AwardReportResponse = {
	competitionId: string;
	generatedAt: string;
	awards: AwardReportItem[];
};

export type AdvanceReportAlliance = {
	rank: number;
	teamIds: string[];
	teams: Array<{ teamId: string; teamNumber?: string; teamName?: string }>;
	matchesPlayed: number;
	rankingScore: number;
	totalScore: number;
	highestScore: number;
	averageScore: number;
	status: 'advanced' | 'reserve';
};

export type AdvanceReportResponse = {
	competitionId: string;
	nextCompetitionId: string | null;
	generatedAt: string;
	alliances: AdvanceReportAlliance[];
};

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

	getAwardReport(id: string, includeUnfinalized = false): Promise<ApiResponse<{ report: AwardReportResponse }>> {
		const query = includeUnfinalized ? '?includeUnfinalized=true' : '';
		return this.http.get<ApiResponse<{ report: AwardReportResponse }>>(
			`/competitions/${id}/award-report${query}`
		);
	}

	getAdvanceReport(id: string, includeUnfinalized = false): Promise<ApiResponse<{ report: AdvanceReportResponse }>> {
		const query = includeUnfinalized ? '?includeUnfinalized=true' : '';
		return this.http.get<ApiResponse<{ report: AdvanceReportResponse }>>(
			`/competitions/${id}/advance-report${query}`
		);
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
