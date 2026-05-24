import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../core/middlewares';
import { scoresService } from './scores.service';

const router = Router();

const MatchIdParamSchema = z.object({
	matchId: z.string().uuid('Match ID must be a valid UUID format')
});

const AllianceScoreSchema = z.object({
	teleIndependent: z.number(),
	sharedScore: z.number(),
	penalties: z.number(),
	endgame: z.number(),
	endgameMultiplier: z.number()
});

const SaveMatchScoreSchema = z.object({
	red: AllianceScoreSchema,
	blue: AllianceScoreSchema,
	status: z.enum(['draft', 'submitted']).optional()
});

router.post(
	'/:matchId/score',
	validate({ params: MatchIdParamSchema, body: SaveMatchScoreSchema }),
	saveMatchScoreHandler
);

router.get(
	'/:matchId/score',
	validate({ params: MatchIdParamSchema }),
	getScoreByMatchIdHandler
);

router.post(
	'/:matchId/score/finalize',
	validate({ params: MatchIdParamSchema }),
	finalizeScoreHandler
);

export { router as scoresRouter };

async function saveMatchScoreHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const score = await scoresService.saveMatchScore(req.params.matchId, req.body);

		res.status(200).json({
			status: 'success',
			data: { score }
		});
	} catch (error) {
		next(error);
	}
}

async function getScoreByMatchIdHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const score = await scoresService.getScoreByMatchId(req.params.matchId);

		res.status(200).json({
			status: 'success',
			data: { score }
		});
	} catch (error) {
		next(error);
	}
}

async function finalizeScoreHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const score = await scoresService.finalizeScore(req.params.matchId);

		res.status(200).json({
			status: 'success',
			data: { score }
		});
	} catch (error) {
		next(error);
	}
}