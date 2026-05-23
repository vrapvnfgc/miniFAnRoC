import { BaseService, type ApiResponse } from '.';

export class HealthService extends BaseService {
	async check(): Promise<ApiResponse<{ status: string; uptime: number; timestamp: string }>> {
		return this.http.get<ApiResponse<{ status: string; uptime: number; timestamp: string }>>(
			'/health'
		);
	}
}
