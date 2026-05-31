import { z } from 'zod';

const fieldStatus = ['ACTIVE', 'INACTIVE'] as const;
export type FieldStatus = (typeof fieldStatus)[number];

export const IFieldSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	competitionId: z.string().optional(),
	description: z.string().optional(),
	status: z.enum(fieldStatus).default('ACTIVE'),
	createdAt: z.date(),
	updatedAt: z.date()
});
export type IField = z.infer<typeof IFieldSchema>;

export const FieldSchema = IFieldSchema.extend({
	id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
});
export type Field = z.infer<typeof FieldSchema>;

export const CreateFieldSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	competitionId: z.string().optional(),
	description: z.string().optional(),
	status: z.enum(fieldStatus).optional()
});
export type CreateField = z.infer<typeof CreateFieldSchema>;

export const UpdateFieldSchema = CreateFieldSchema.partial();
export type UpdateField = z.infer<typeof UpdateFieldSchema>;

export const FieldResponseSchema = FieldSchema.extend({
	createdAt: z.string().or(z.date()),
	updatedAt: z.string().or(z.date())
});
export type FieldResponse = z.infer<typeof FieldResponseSchema>;
