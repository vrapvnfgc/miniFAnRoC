import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../core/middlewares';
import { matchesService } from './matches.service';

const router = Router();

const MatchIdParamSchema = z.object({
	id: z.string().uuid('Match ID must be a valid UUID format')
});

const MatchStatusSchema = z.enum([
	'queued',
	'scheduled',
	'in_progress',
	'finished',
	'terminated'
]);

const MatchPhaseSchema = z.enum(['qualification', 'semifinal', 'final']);

const CreateMatchSchema = z.object({
	matchNumber: z.number().int().positive('Match number must be positive'),
	phase: MatchPhaseSchema,
	fieldId: z.string().uuid('Field ID must be a valid UUID format'),
	redTeamIds: z.array(z.string().uuid()).length(2, 'Red alliance must have exactly 2 teams'),
	blueTeamIds: z.array(z.string().uuid()).length(2, 'Blue alliance must have exactly 2 teams'),
	status: MatchStatusSchema.optional(),
	scheduledTime: z.string().datetime().optional(),
	startTime: z.string().datetime().optional(),
	endTime: z.string().datetime().optional(),
	notes: z.string().optional()
});

const UpdateMatchSchema = CreateMatchSchema.partial();

router.post('/', validate({ body: CreateMatchSchema }), createMatchHandler);
router.get('/', getAllMatchesHandler);
router.get('/:id', validate({ params: MatchIdParamSchema }), getMatchByIdHandler);
router.patch(
	'/:id',
	validate({ params: MatchIdParamSchema, body: UpdateMatchSchema }),
	updateMatchHandler
);
router.delete('/:id', validate({ params: MatchIdParamSchema }), deleteMatchHandler);

export { router as matchesRouter };

async function createMatchHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const match = await matchesService.createMatch(req.body);

		res.status(201).json({
			status: 'success',
			data: { match }
		});
	} catch (error) {
		next(error);
	}
}

async function getAllMatchesHandler(_req: Request, res: Response, next: NextFunction) {
	try {
		const matches = await matchesService.getAllMatches();

		res.status(200).json({
			status: 'success',
			data: { matches }
		});
	} catch (error) {
		next(error);
	}
}

async function getMatchByIdHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const match = await matchesService.getMatchById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: { match }
		});
	} catch (error) {
		next(error);
	}
}

async function updateMatchHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const match = await matchesService.updateMatch(req.params.id, req.body);

		res.status(200).json({
			status: 'success',
			data: { match }
		});
	} catch (error) {
		next(error);
	}
}

async function deleteMatchHandler(req: Request, res: Response, next: NextFunction) {
	try {
		await matchesService.deleteMatch(req.params.id);

		res.status(204).send();
	} catch (error) {
		next(error);
	}
}