import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from './errors';

export function pathParam(value: string | string[]): string {
	return Array.isArray(value) ? (value[0] ?? '') : value;
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
	const start = Date.now();
	res.on('finish', () => {
		const duration = Date.now() - start;
		const timestamp = new Date().toISOString();
		console.log(
			`[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
		);
	});
	next();
};

export const validate = (schemas: {
	body?: AnyZodObject;
	query?: AnyZodObject;
	params?: AnyZodObject;
}) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			if (schemas.params) {
				req.params = await schemas.params.parseAsync(req.params);
			}
			if (schemas.query) {
				req.query = await schemas.query.parseAsync(req.query);
			}
			if (schemas.body) {
				req.body = await schemas.body.parseAsync(req.body);
			}
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const details = error.errors.map((err) => ({
					path: err.path.join('.'),
					message: err.message
				}));
				return next(AppError.badRequest('Validation failed', 'VALIDATION_ERROR', details));
			}
			next(error);
		}
	};
};

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
	const statusCode = err.statusCode || 500;
	const status = err.status || 'error';
	const message = err.message || 'Internal server error';
	const code = err.code || 'INTERNAL_SERVER_ERROR';
	const details = err.details || undefined;

	if (statusCode >= 500) {
		console.error(`[CRITICAL ERROR] ${req.method} ${req.path}\n`, err);
	}

	res.status(statusCode).json({
		status,
		error: {
			code,
			message,
			...(details && { details }),
			...(String(process.env.NODE_ENV) === 'development' && { stack: err.stack })
		}
	});
};
