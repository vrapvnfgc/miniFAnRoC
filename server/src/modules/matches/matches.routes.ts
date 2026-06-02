import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../core/middlewares';
import { matchesService } from './matches.service';
import { auditLogger } from '../../core/audit.logger';

const router = Router();

const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

const MatchIdParamSchema = z.object({
	id: ObjectIdSchema
});

const MatchStatusSchema = z.enum(['queued', 'scheduled', 'in_progress', 'finished', 'terminated']);

const MatchPhaseSchema = z.enum(['qualification', 'semifinal', 'final']);

const CreateMatchSchema = z.object({
	matchNumber: z.number().int().positive('Match number must be positive'),
	phase: MatchPhaseSchema,
		fieldId: ObjectIdSchema,
		competitionId: ObjectIdSchema.optional(),
	redTeamIds: z.array(ObjectIdSchema).length(2, 'Red alliance must have exactly 2 teams'),
	blueTeamIds: z.array(ObjectIdSchema).length(2, 'Blue alliance must have exactly 2 teams'),
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

		await auditLogger.logAction({
			req,
			action: 'CREATE',
			resource: 'MATCH',
			resourceId: String(match.id),
			details: req.body
		});

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

		await auditLogger.logAction({
			req,
			action: 'UPDATE',
			resource: 'MATCH',
			resourceId: req.params.id,
			details: req.body
		});

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

		await auditLogger.logAction({
			req,
			action: 'DELETE',
			resource: 'MATCH',
			resourceId: req.params.id
		});

		res.status(204).send();
	} catch (error) {
		next(error);
	}
}
