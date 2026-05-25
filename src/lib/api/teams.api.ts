import { BaseService, type ApiResponse } from './index';

export type TeamResponse = {
	id: string;
	teamNumber: string;
	name: string;
	school: string;
	coach?: string;
	robotName?: string;
	members?: string[];
	createdAt: string;
	updatedAt: string;
};

export type CreateTeam = {
	teamNumber: string;
	name: string;
	school: string;
	coach?: string;
	robotName?: string;
	members?: string[];
};

export type UpdateTeam = Partial<CreateTeam>;

export class TeamsService extends BaseService {
	async getAll(): Promise<ApiResponse<{ teams: TeamResponse[] }>> {
		return this.http.get<ApiResponse<{ teams: TeamResponse[] }>>('/teams');
	}

	async getById(id: string): Promise<ApiResponse<{ team: TeamResponse }>> {
		return this.http.get<ApiResponse<{ team: TeamResponse }>>(`/teams/${id}`);
	}

	async create(data: CreateTeam): Promise<ApiResponse<{ team: TeamResponse }>> {
		return this.http.post<ApiResponse<{ team: TeamResponse }>>('/teams', data);
	}

	async update(id: string, data: UpdateTeam): Promise<ApiResponse<{ team: TeamResponse }>> {
		return this.http.patch<ApiResponse<{ team: TeamResponse }>>(`/teams/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return this.http.delete<void>(`/teams/${id}`);
	}
}

export const teamsApi = new TeamsService();
