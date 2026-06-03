import { Router, Request, Response, NextFunction } from 'express';
import { CreateUserSchema } from '@shared';
import { validate } from '../../core/middlewares';
import { usersService } from './users.service';
import { z } from 'zod';
import { requireAuth, requireAdmin } from '../../core/auth.middleware';
import { auditLogger } from '../../core/audit.logger';

const router = Router();

const UserIdParamSchema = z.object({
	id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'User ID must be a valid MongoDB ObjectId format')
});

router.post('/', validate({ body: CreateUserSchema }), createUserHandler);
router.get('/', requireAdmin, getAllUsersHandler);
router.get('/:id', requireAuth, validate({ params: UserIdParamSchema }), getUserByIdHandler);

export { router as usersRouter };

async function createUserHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const user = await usersService.createUser(req.body);

		await auditLogger.logAction({
			req,
			action: 'CREATE',
			resource: 'USER',
			resourceId: String(user.id),
			details: req.body
		});

		res.status(201).json({
			status: 'success',
			data: { user }
		});
	} catch (error) {
		next(error);
	}
}

async function getUserByIdHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const user = await usersService.getUserById(req.params.id);
		res.status(200).json({
			status: 'success',
			data: { user }
		});
	} catch (error) {
		next(error);
	}
}

async function getAllUsersHandler(_req: Request, res: Response, next: NextFunction) {
	try {
		const users = await usersService.getAllUsers();
		res.status(200).json({
			status: 'success',
			data: { users }
		});
	} catch (error) {
		next(error);
	}
}
