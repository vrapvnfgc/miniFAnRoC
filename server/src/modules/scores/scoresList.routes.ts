import { Router, Request, Response, NextFunction } from 'express';
import { scoresService } from './scores.service';
import { requireAdmin } from '../../core/auth.middleware';

const router = Router();

router.get('/', requireAdmin, getAllScoresHandler);

export { router as scoresListRouter };

async function getAllScoresHandler(_req: Request, res: Response, next: NextFunction) {
	try {
		const scores = await scoresService.getAllScores();
		res.status(200).json({
			status: 'success',
			data: { scores }
		});
	} catch (error) {
		next(error);
	}
}
