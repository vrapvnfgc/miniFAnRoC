import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { LoginSchema } from '@shared';
import { validate } from '../../core/middlewares';
import { usersService, verifyPassword } from '../users/users.service';
import { config } from '../../config';
import { AppError } from '../../core/errors';
import { AuthenticatedRequest, requireAuth } from '../../core/auth.middleware';

const router = Router();

function generateToken(user: { id: string; email: string; role: string }) {
	return jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, {
		expiresIn: '24h'
	});
}

router.post('/login', validate({ body: LoginSchema }), loginHandler);
router.get('/me', requireAuth, getMeHandler);

export { router as authRouter };

async function loginHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const { email, password } = req.body;
		const userDoc = await usersService.getUserByEmail(email);

		if (!userDoc) {
			throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
		}

		const isMatch = await verifyPassword(password, userDoc.passwordHash);
		if (!isMatch) {
			throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
		}

		const user = {
			id: userDoc._id.toString(),
			email: userDoc.email,
			name: userDoc.name,
			role: userDoc.role,
			createdAt: userDoc.createdAt,
			updatedAt: userDoc.updatedAt
		};

		const token = generateToken(user);

		res.status(200).json({
			status: 'success',
			data: { user, token }
		});
	} catch (error) {
		next(error);
	}
}

async function getMeHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	try {
		if (!req.user) {
			throw AppError.unauthorized('Not authenticated', 'NOT_AUTHENTICATED');
		}

		const user = await usersService.getUserById(req.user.id);

		res.status(200).json({
			status: 'success',
			data: { user }
		});
	} catch (error) {
		next(error);
	}
}
