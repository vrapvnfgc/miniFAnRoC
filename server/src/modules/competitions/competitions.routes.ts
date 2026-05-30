import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../core/middlewares';
import { competitionsService } from './competitions.service';

const router = Router();

const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

const CompetitionIdParamSchema = z.object({
	id: ObjectIdSchema
});

const CompetitionStatusSchema = z.enum(['upcoming', 'active', 'completed']);

const CreateCompetitionSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	status: CompetitionStatusSchema.optional(),
	startDate: z.string().datetime().optional(),
	endDate: z.string().datetime().optional()
});

const UpdateCompetitionSchema = CreateCompetitionSchema.partial();

router.post('/', validate({ body: CreateCompetitionSchema }), createCompetitionHandler);
router.get('/', getAllCompetitionsHandler);
router.get('/:id', validate({ params: CompetitionIdParamSchema }), getCompetitionByIdHandler);
router.patch(
	'/:id',
	validate({ params: CompetitionIdParamSchema, body: UpdateCompetitionSchema }),
	updateCompetitionHandler
);
router.delete('/:id', validate({ params: CompetitionIdParamSchema }), deleteCompetitionHandler);

export { router as competitionsRouter };

async function createCompetitionHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const competition = await competitionsService.createCompetition(req.body);

		res.status(201).json({
			status: 'success',
			data: { competition }
		});
	} catch (error) {
		next(error);
	}
}

async function getAllCompetitionsHandler(_req: Request, res: Response, next: NextFunction) {
	try {
		const competitions = await competitionsService.getAllCompetitions();

		res.status(200).json({
			status: 'success',
			data: { competitions }
		});
	} catch (error) {
		next(error);
	}
}

async function getCompetitionByIdHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const competition = await competitionsService.getCompetitionById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: { competition }
		});
	} catch (error) {
		next(error);
	}
}

async function updateCompetitionHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const competition = await competitionsService.updateCompetition(req.params.id, req.body);

		res.status(200).json({
			status: 'success',
			data: { competition }
		});
	} catch (error) {
		next(error);
	}
}

async function deleteCompetitionHandler(req: Request, res: Response, next: NextFunction) {
	try {
		await competitionsService.deleteCompetition(req.params.id);

		res.status(204).send();
	} catch (error) {
		next(error);
	}
}
