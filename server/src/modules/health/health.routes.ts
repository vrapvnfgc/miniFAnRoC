import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', getHealthHandler);

export { router as healthRouter };

function getHealthHandler(_req: Request, res: Response, next: NextFunction) {
	try {
		res.status(200).json({
			status: 'success',
			data: {
				status: 'UP',
				uptime: process.uptime(),
				timestamp: new Date().toISOString()
			}
		});
	} catch (error) {
		next(error);
	}
}
