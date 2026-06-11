import { AuditLogResponse } from '@shared';
import { AuditLogModel } from './auditLogs.model';

function mapAuditLog(log: any): AuditLogResponse {
	return {
		id: String(log._id),
		actorId: log.actorId ? String(log.actorId) : undefined,
		action: log.action,
		resource: log.resource,
		resourceId: log.resourceId ? String(log.resourceId) : undefined,
		details: log.details,
		ipAddress: log.ipAddress,
		userAgent: log.userAgent,
		createdAt: log.createdAt
	};
}

class AuditLogsService {
	async getAllAuditLogs(): Promise<AuditLogResponse[]> {
		const logs = await AuditLogModel.find().sort({ createdAt: -1 }).limit(100);
		return logs.map(mapAuditLog);
	}
}

export const auditLogsService = new AuditLogsService();
