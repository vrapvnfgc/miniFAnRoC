import { z } from 'zod';

export const AuditLogActionSchema = z.enum([
	'CREATE',
	'UPDATE',
	'DELETE',
	'LOGIN',
	'LOGOUT',
	'OTHER'
]);

export const AuditLogSchema = z.object({
	id: z.string(),
	actorId: z.string().optional(), // Could be optional if action is done by system or unauthenticated user
	action: AuditLogActionSchema,
	resource: z.string(),
	resourceId: z.string().optional(),
	details: z.record(z.string(), z.any()).optional(),
	ipAddress: z.string().optional(),
	userAgent: z.string().optional(),
	createdAt: z.date()
});

export const CreateAuditLogSchema = AuditLogSchema.omit({
	id: true,
	createdAt: true
});

export type AuditLogAction = z.infer<typeof AuditLogActionSchema>;
export type AuditLogResponse = z.infer<typeof AuditLogSchema>;
export type CreateAuditLog = z.infer<typeof CreateAuditLogSchema>;
