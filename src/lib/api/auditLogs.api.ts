import { BaseService, type ApiResponse } from './base';
import type { AuditLogResponse } from '@shared';

export class AuditLogsService extends BaseService {
	getAll(): Promise<ApiResponse<{ auditLogs: AuditLogResponse[] }>> {
		return this.http.get<ApiResponse<{ auditLogs: AuditLogResponse[] }>>('/audit-logs');
	}
}
