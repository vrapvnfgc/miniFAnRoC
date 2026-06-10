import { BaseService, type ApiResponse } from './base';

export type TeamResponse = {
	id: string;
	competitionIds?: string[];
	teamNumber: string;
	name: string;
	school: string;
	location?: string;
	representativeEmail?: string;
	representativePhone?: string;
	coach?: string;
	teacherName?: string;
	teacherEmail?: string;
	teacherPhone?: string;
	robotName?: string;
	members?: string[];
	memberDetails?: { name: string; className: string }[];
	createdAt: string;
	updatedAt: string;
};

export type CreateTeam = {
	teamNumber: string;
	competitionIds?: string[];
	name: string;
	school: string;
	location?: string;
	representativeEmail?: string;
	representativePhone?: string;
	coach?: string;
	teacherName?: string;
	teacherEmail?: string;
	teacherPhone?: string;
	robotName?: string;
	members?: string[];
	memberDetails?: { name: string; className: string }[];
};

export type UpdateTeam = Partial<CreateTeam>;

export class TeamsService extends BaseService {
	getAll(): Promise<ApiResponse<{ teams: TeamResponse[] }>> {
		return this.http.get<ApiResponse<{ teams: TeamResponse[] }>>('/teams');
	}

	getById(id: string): Promise<ApiResponse<{ team: TeamResponse }>> {
		return this.http.get<ApiResponse<{ team: TeamResponse }>>(`/teams/${id}`);
	}

	create(data: CreateTeam): Promise<ApiResponse<{ team: TeamResponse }>> {
		return this.http.post<ApiResponse<{ team: TeamResponse }>>('/teams', data);
	}

	update(id: string, data: UpdateTeam): Promise<ApiResponse<{ team: TeamResponse }>> {
		return this.http.patch<ApiResponse<{ team: TeamResponse }>>(`/teams/${id}`, data);
	}

	delete(id: string): Promise<void> {
		return this.http.delete<void>(`/teams/${id}`);
	}
}
