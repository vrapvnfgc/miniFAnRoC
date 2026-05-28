import { z } from 'zod';

const scoreStatuses = ['draft', 'submitted', 'finalized'] as const;
export type ScoreStatus = (typeof scoreStatuses)[number];

export const AllianceScoreInputSchema = z.object({
	teleIndependent: z.number().default(0),
	sharedScore: z.number().default(0),
	penalties: z.number().default(0),
	endgame: z.number().default(0),
	endgameMultiplier: z.number().default(1)
});
export type AllianceScoreInput = z.infer<typeof AllianceScoreInputSchema>;

export const AllianceScoreSchema = AllianceScoreInputSchema.extend({
	total: z.number().default(0)
});
export type IAllianceScore = z.infer<typeof AllianceScoreSchema>;
export type AllianceScoreResponse = IAllianceScore;

export const IMatchScoreSchema = z.object({
	matchId: z.string(),
	red: AllianceScoreSchema,
	blue: AllianceScoreSchema,
	status: z.enum(scoreStatuses).default('draft'),
	submittedAt: z.date().optional(),
	finalizedAt: z.date().optional(),
	createdAt: z.date(),
	updatedAt: z.date()
});
export type IMatchScore = z.infer<typeof IMatchScoreSchema>;

export const MatchScoreSchema = IMatchScoreSchema.extend({
	id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
});
export type MatchScore = z.infer<typeof MatchScoreSchema>;

export const SaveMatchScoreInputSchema = z.object({
	red: AllianceScoreInputSchema,
	blue: AllianceScoreInputSchema,
	status: z.enum(['draft', 'submitted']).optional()
});
export type SaveMatchScoreInput = z.infer<typeof SaveMatchScoreInputSchema>;

export const MatchScoreResponseSchema = MatchScoreSchema.extend({
	submittedAt: z.string().or(z.date()).optional(),
	finalizedAt: z.string().or(z.date()).optional(),
	createdAt: z.string().or(z.date()),
	updatedAt: z.string().or(z.date())
});
export type MatchScoreResponse = z.infer<typeof MatchScoreResponseSchema>;
