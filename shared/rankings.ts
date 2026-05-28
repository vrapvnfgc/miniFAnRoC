import { z } from 'zod';

export const RankingItemSchema = z.object({
	rank: z.number().int().positive().or(z.literal(0)),
	teamId: z.string(),
	teamNumber: z.string(),
	teamName: z.string(),
	rankingScore: z.number(),
	highestMatchScore: z.number(),
	bonusPoint: z.number(),
	matchesPlayed: z.number().int().nonnegative(),
	reason: z.string()
});
export type RankingItem = z.infer<typeof RankingItemSchema>;
