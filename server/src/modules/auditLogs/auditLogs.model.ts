import mongoose, { Schema, Document } from 'mongoose';
import { AuditLogAction } from '@shared';

export interface IAuditLog extends Document {
	actorId?: string;
	action: AuditLogAction;
	resource: string;
	resourceId?: string;
	details?: Record<string, any>;
	ipAddress?: string;
	userAgent?: string;
	createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
	{
		actorId: { type: String, index: true },
		action: { type: String, required: true, index: true },
		resource: { type: String, required: true, index: true },
		resourceId: { type: String },
		details: { type: Schema.Types.Mixed },
		ipAddress: { type: String },
		userAgent: { type: String }
	},
	{
		timestamps: { createdAt: true, updatedAt: false }
	}
);

export const AuditLogModel = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
