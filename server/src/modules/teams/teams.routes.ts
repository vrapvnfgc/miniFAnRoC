import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../core/middlewares';
import { teamsService } from './teams.service';

const router = Router();

const ObjectIdSchema = z
	.string()
	.regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

const TeamIdParamSchema = z.object({
	id: ObjectIdSchema
});

const CreateTeamSchema = z.object({
	teamNumber: z.string().min(1, 'Team number is required'),
	name: z.string().min(1, 'Team name is required'),
	school: z.string().min(1, 'School is required'),
	coach: z.string().optional(),
	robotName: z.string().optional(),
	members: z.array(z.string()).optional()
});

const UpdateTeamSchema = CreateTeamSchema.partial();

router.post('/', validate({ body: CreateTeamSchema }), createTeamHandler);
router.get('/', getAllTeamsHandler);
router.get('/:id', validate({ params: TeamIdParamSchema }), getTeamByIdHandler);
router.patch(
	'/:id',
	validate({ params: TeamIdParamSchema, body: UpdateTeamSchema }),
	updateTeamHandler
);
router.delete('/:id', validate({ params: TeamIdParamSchema }), deleteTeamHandler);

export { router as teamsRouter };

async function createTeamHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const team = await teamsService.createTeam(req.body);

		res.status(201).json({
			status: 'success',
			data: { team }
		});
	} catch (error) {
		next(error);
	}
}

async function getAllTeamsHandler(_req: Request, res: Response, next: NextFunction) {
	try {
		const teams = await teamsService.getAllTeams();

		res.status(200).json({
			status: 'success',
			data: { teams }
		});
	} catch (error) {
		next(error);
	}
}

async function getTeamByIdHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const team = await teamsService.getTeamById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: { team }
		});
	} catch (error) {
		next(error);
	}
}

async function updateTeamHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const team = await teamsService.updateTeam(req.params.id, req.body);

		res.status(200).json({
			status: 'success',
			data: { team }
		});
	} catch (error) {
		next(error);
	}
}

async function deleteTeamHandler(req: Request, res: Response, next: NextFunction) {
	try {
		await teamsService.deleteTeam(req.params.id);

		res.status(204).send();
	} catch (error) {
		next(error);
	}
}
