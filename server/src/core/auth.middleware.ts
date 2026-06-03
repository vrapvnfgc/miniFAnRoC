import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './errors';

export interface AuthenticatedRequest extends Request {
	user?: {
		id: string;
		email: string;
		role: 'USER' | 'ADMIN';
	};
}

export const requireAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return next(AppError.unauthorized('Authentication token is required', 'TOKEN_MISSING'));
	}

	const token = authHeader.split(' ')[1];
	try {
		const decoded = jwt.verify(token, config.jwtSecret) as {
			id: string;
			email: string;
			role: 'USER' | 'ADMIN';
		};
		req.user = decoded;
		next();
	} catch (error: any) {
		if (error.name === 'TokenExpiredError') {
			return next(AppError.unauthorized('Authentication token has expired', 'TOKEN_EXPIRED'));
		}
		return next(AppError.unauthorized('Invalid authentication token', 'INVALID_TOKEN'));
	}
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	requireAuth(req, res, (err) => {
		if (err) return next(err);
		if (req.user?.role !== 'ADMIN') {
			return next(AppError.forbidden('Administrator privileges are required', 'FORBIDDEN_ACCESS'));
		}
		next();
	});
};
