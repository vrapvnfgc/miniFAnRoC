import { BaseService, type ApiResponse } from '.';
import type { CreateUser, UserResponse } from '@shared';

export class UserService extends BaseService {
	async create(data: CreateUser): Promise<ApiResponse<{ user: UserResponse }>> {
		return this.http.post<ApiResponse<{ user: UserResponse }>>('/users', data);
	}

	async get(id: string): Promise<ApiResponse<{ user: UserResponse }>> {
		return this.http.get<ApiResponse<{ user: UserResponse }>>(`/users/${id}`);
	}

	async list(): Promise<ApiResponse<{ users: UserResponse[] }>> {
		return this.http.get<ApiResponse<{ users: UserResponse[] }>>('/users');
	}
}
