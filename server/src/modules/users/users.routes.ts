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

const UpdateUserSchema = z.object({
	name: z.string().min(2).optional(),
	email: z.string().email().optional(),
	password: z.string().min(8).optional(),
	role: z.enum(['USER', 'ADMIN']).optional()
});

router.patch('/:id', requireAdmin, validate({ params: UserIdParamSchema, body: UpdateUserSchema }), updateUserHandler);
router.delete('/:id', requireAdmin, validate({ params: UserIdParamSchema }), deleteUserHandler);

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

async function updateUserHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const user = await usersService.updateUser(req.params.id, req.body);

		await auditLogger.logAction({
			req,
			action: 'UPDATE',
			resource: 'USER',
			resourceId: req.params.id,
			details: req.body
		});

		res.status(200).json({
			status: 'success',
			data: { user }
		});
	} catch (error) {
		next(error);
	}
}

async function deleteUserHandler(req: Request, res: Response, next: NextFunction) {
	try {
		await usersService.deleteUser(req.params.id);

		await auditLogger.logAction({
			req,
			action: 'DELETE',
			resource: 'USER',
			resourceId: req.params.id
		});

		res.status(204).send();
	} catch (error) {
		next(error);
	}
}
