import { Router, Request, Response, NextFunction } from 'express';
import { rankingsService } from './rankings.service';

const router = Router();

router.get('/', getRankingsHandler);

export { router as rankingsRouter };

async function getRankingsHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const includeUnfinalized = req.query.includeUnfinalized === 'true';

		const rankings = await rankingsService.getRankings(includeUnfinalized);

		res.status(200).json({
			status: 'success',
			data: { rankings }
		});
	} catch (error) {
		next(error);
	}
}
