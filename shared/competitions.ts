import { z } from 'zod';

const competitionStatuses = ['upcoming', 'active', 'completed'] as const;
export type CompetitionStatus = (typeof competitionStatuses)[number];

export const ICompetitionSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	status: z.enum(competitionStatuses).default('upcoming'),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	createdAt: z.date(),
	updatedAt: z.date()
});
export type ICompetition = z.infer<typeof ICompetitionSchema>;

export const CompetitionSchema = ICompetitionSchema.extend({
	id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
});
export type Competition = z.infer<typeof CompetitionSchema>;

export const CreateCompetitionSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	status: z.enum(competitionStatuses).optional(),
	startDate: z.string().or(z.date()).optional(),
	endDate: z.string().or(z.date()).optional()
});
export type CreateCompetition = z.infer<typeof CreateCompetitionSchema>;

export const UpdateCompetitionSchema = CreateCompetitionSchema.partial();
export type UpdateCompetition = z.infer<typeof UpdateCompetitionSchema>;

export const CompetitionResponseSchema = CompetitionSchema.extend({
	startDate: z.string().or(z.date()).optional(),
	endDate: z.string().or(z.date()).optional(),
	createdAt: z.string().or(z.date()),
	updatedAt: z.string().or(z.date())
});
export type CompetitionResponse = z.infer<typeof CompetitionResponseSchema>;
