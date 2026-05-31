import { Request } from 'express';
import { AuditLogModel } from '../modules/auditLogs/auditLogs.model';
import { AuditLogAction } from '@shared';

interface LogActionParams {
	req: Request;
	action: AuditLogAction;
	resource: string;
	resourceId?: string;
	details?: Record<string, any>;
}

class AuditLogger {
	/**
	 * Logs an audit action asynchronously.
	 * Uses try/catch so that logging failures do not interrupt the main request flow.
	 */
	public async logAction(params: LogActionParams): Promise<void> {
		try {
			// Extract actorId from req.user if available
			// We cast to any because req.user typing depends on the auth middleware
			const actorId = (params.req as any).user?.id || (params.req as any).user?._id;

			// Extract IP address
			const ipAddress =
				params.req.ip ||
				(params.req.headers['x-forwarded-for'] as string) ||
				params.req.socket.remoteAddress;

			// Extract User Agent
			const userAgent = params.req.headers['user-agent'];

			await AuditLogModel.create({
				actorId: actorId ? String(actorId) : undefined,
				action: params.action,
				resource: params.resource,
				resourceId: params.resourceId,
				details: params.details,
				ipAddress: ipAddress,
				userAgent: userAgent
			});
		} catch (error) {
			console.error('Failed to save audit log:', error);
			// We intentionally do NOT throw the error here
		}
	}
}

export const auditLogger = new AuditLogger();
