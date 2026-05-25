import { BaseService, type ApiResponse } from './index';

export type MatchPhase = 'qualification' | 'semifinal' | 'final';

export type MatchStatus =
	| 'queued'
	| 'scheduled'
	| 'in_progress'
	| 'finished'
	| 'terminated';

export type MatchResponse = {
	id: string;
	matchNumber: number;
	phase: MatchPhase;
	fieldId: string;
	redTeamIds: string[];
	blueTeamIds: string[];
	status: MatchStatus;
	scheduledTime?: string;
	startTime?: string;
	endTime?: string;
	notes?: string;
	createdAt: string;
	updatedAt: string;
};

export type CreateMatch = {
	matchNumber: number;
	phase: MatchPhase;
	fieldId: string;
	redTeamIds: string[];
	blueTeamIds: string[];
	status?: MatchStatus;
	scheduledTime?: string;
	startTime?: string;
	endTime?: string;
	notes?: string;
};

export type UpdateMatch = Partial<CreateMatch>;

export class MatchesService extends BaseService {
	async getAll(): Promise<ApiResponse<{ matches: MatchResponse[] }>> {
		return this.http.get<ApiResponse<{ matches: MatchResponse[] }>>('/matches');
	}

	async getById(id: string): Promise<ApiResponse<{ match: MatchResponse }>> {
		return this.http.get<ApiResponse<{ match: MatchResponse }>>(`/matches/${id}`);
	}

	async create(data: CreateMatch): Promise<ApiResponse<{ match: MatchResponse }>> {
		return this.http.post<ApiResponse<{ match: MatchResponse }>>('/matches', data);
	}

	async update(id: string, data: UpdateMatch): Promise<ApiResponse<{ match: MatchResponse }>> {
		return this.http.patch<ApiResponse<{ match: MatchResponse }>>(`/matches/${id}`, data);
	}

	async updateStatus(id: string, status: MatchStatus): Promise<ApiResponse<{ match: MatchResponse }>> {
		return this.update(id, { status });
	}

	async delete(id: string): Promise<void> {
		return this.http.delete<void>(`/matches/${id}`);
	}
}

export const matchesApi = new MatchesService();
