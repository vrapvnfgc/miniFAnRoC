import { z } from 'zod';

export const ITeamSchema = z.object({
	teamNumber: z.string().min(1, 'Team number is required'),
	competitionIds: z.array(z.string()).optional(),
	name: z.string().min(1, 'Name is required'),
	school: z.string().min(1, 'School is required'),
	coach: z.string().optional(),
	robotName: z.string().optional(),
	members: z.array(z.string()).optional(),
	createdAt: z.date(),
	updatedAt: z.date()
});
export type ITeam = z.infer<typeof ITeamSchema>;

export const TeamSchema = ITeamSchema.extend({
	id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
});
export type Team = z.infer<typeof TeamSchema>;

export const CreateTeamSchema = z.object({
	teamNumber: z.string().min(1, 'Team number is required'),
	competitionIds: z.array(z.string()).optional(),
	name: z.string().min(1, 'Name is required'),
	school: z.string().min(1, 'School is required'),
	coach: z.string().optional(),
	robotName: z.string().optional(),
	members: z.array(z.string()).optional()
});
export type CreateTeam = z.infer<typeof CreateTeamSchema>;

export const UpdateTeamSchema = CreateTeamSchema.partial();
export type UpdateTeam = z.infer<typeof UpdateTeamSchema>;

export const TeamResponseSchema = TeamSchema.extend({
	createdAt: z.string().or(z.date()),
	updatedAt: z.string().or(z.date())
});
export type TeamResponse = z.infer<typeof TeamResponseSchema>;
