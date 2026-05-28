import { BaseService, type ApiResponse } from './base';
import type { LoginInput, UserResponse } from '@shared';

export class AuthService extends BaseService {
	async login(data: LoginInput): Promise<ApiResponse<{ user: UserResponse; token: string }>> {
		return this.http.post<ApiResponse<{ user: UserResponse; token: string }>>('/auth/login', data);
	}

	async me(token: string): Promise<ApiResponse<{ user: UserResponse }>> {
		return this.http.get<ApiResponse<{ user: UserResponse }>>('/auth/me', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	}
}
