export class AppError extends Error {
	public readonly status: 'fail' | 'error';

	constructor(
		public readonly statusCode: number,
		public readonly code: string,
		message: string,
		public readonly details?: any
	) {
		super(message);
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		Object.setPrototypeOf(this, new.target.prototype);
		Error.captureStackTrace(this, this.constructor);
	}

	static badRequest(message: string, code = 'BAD_REQUEST', details?: any) {
		return new AppError(400, code, message, details);
	}

	static unauthorized(message: string, code = 'UNAUTHORIZED') {
		return new AppError(401, code, message);
	}

	static forbidden(message: string, code = 'FORBIDDEN') {
		return new AppError(403, code, message);
	}

	static notFound(message: string, code = 'NOT_FOUND') {
		return new AppError(404, code, message);
	}

	static conflict(message: string, code = 'CONFLICT') {
		return new AppError(409, code, message);
	}

	static internal(message: string, code = 'INTERNAL_SERVER_ERROR') {
		return new AppError(500, code, message);
	}
}
