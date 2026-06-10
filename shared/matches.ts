import { z } from 'zod';

const matchPhases = ['qualification', 'playoff'] as const;
export type MatchPhase = (typeof matchPhases)[number];

const matchStatuses = ['queued', 'scheduled', 'in_progress', 'finished', 'terminated'] as const;
export type MatchStatus = (typeof matchStatuses)[number];

export const IMatchSchema = z.object({
	matchNumber: z.number().int().positive(),
	competitionId: z.string().optional(),
	phase: z.enum(matchPhases),
	fieldId: z.string(),
	redTeamIds: z.array(z.string()).length(2, 'Red alliance must have exactly 2 teams'),
	blueTeamIds: z.array(z.string()).length(2, 'Blue alliance must have exactly 2 teams'),
	status: z.enum(matchStatuses).default('queued'),
	scheduledTime: z.date().optional(),
	startTime: z.date().optional(),
	endTime: z.date().optional(),
	notes: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date()
});
export type IMatch = z.infer<typeof IMatchSchema>;

export const MatchSchema = IMatchSchema.extend({
	id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
});
export type Match = z.infer<typeof MatchSchema>;

export const CreateMatchSchema = z.object({
	matchNumber: z.number().int().positive(),
	competitionId: z.string().optional(),
	phase: z.enum(matchPhases),
	fieldId: z.string(),
	redTeamIds: z.array(z.string()).length(2, 'Red alliance must have exactly 2 teams'),
	blueTeamIds: z.array(z.string()).length(2, 'Blue alliance must have exactly 2 teams'),
	status: z.enum(matchStatuses).optional(),
	scheduledTime: z.string().or(z.date()).optional(),
	startTime: z.string().or(z.date()).optional(),
	endTime: z.string().or(z.date()).optional(),
	notes: z.string().optional()
});
export type CreateMatch = z.infer<typeof CreateMatchSchema>;

export const UpdateMatchSchema = CreateMatchSchema.partial();
export type UpdateMatch = z.infer<typeof UpdateMatchSchema>;

export const MatchResponseSchema = MatchSchema.extend({
	scheduledTime: z.string().or(z.date()).optional(),
	startTime: z.string().or(z.date()).optional(),
	endTime: z.string().or(z.date()).optional(),
	createdAt: z.string().or(z.date()),
	updatedAt: z.string().or(z.date())
});
export type MatchResponse = z.infer<typeof MatchResponseSchema>;
