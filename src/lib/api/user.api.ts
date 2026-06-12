import { BaseService, type ApiResponse } from './base';
import type { CreateUser, UserResponse } from '@shared';

export class UserService extends BaseService {
	async create(
		data: CreateUser,
		options?: RequestInit
	): Promise<ApiResponse<{ user: UserResponse }>> {
		return this.http.post<ApiResponse<{ user: UserResponse }>>('/users', data, options);
	}

	async get(id: string, options?: RequestInit): Promise<ApiResponse<{ user: UserResponse }>> {
		return this.http.get<ApiResponse<{ user: UserResponse }>>(`/users/${id}`, options);
	}

	async list(options?: RequestInit): Promise<ApiResponse<{ users: UserResponse[] }>> {
		return this.http.get<ApiResponse<{ users: UserResponse[] }>>('/users', options);
	}

	async update(
		id: string,
		data: Partial<CreateUser>,
		options?: RequestInit
	): Promise<ApiResponse<{ user: UserResponse }>> {
		return this.http.patch<ApiResponse<{ user: UserResponse }>>(`/users/${id}`, data, options);
	}

	async delete(id: string, options?: RequestInit): Promise<ApiResponse<void>> {
		return this.http.delete<ApiResponse<void>>(`/users/${id}`, options);
	}
}
