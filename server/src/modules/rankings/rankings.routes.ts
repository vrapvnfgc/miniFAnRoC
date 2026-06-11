import { Router, Request, Response, NextFunction } from 'express';
import { rankingsService } from './rankings.service';
import { requireAuth } from '../../core/auth.middleware';

const router = Router();

router.get('/', requireAuth, getRankingsHandler);

export { router as rankingsRouter };

async function getRankingsHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const includeUnfinalized = req.query.includeUnfinalized === 'true';
		const competitionId = req.query.competitionId as string;

		let rankings;
		if (competitionId) {
			rankings = await rankingsService.getRankingsForCompetition(competitionId, includeUnfinalized);
		} else {
			rankings = await rankingsService.getRankings(includeUnfinalized);
		}

		res.status(200).json({
			status: 'success',
			data: { rankings }
		});
	} catch (error) {
		next(error);
	}
}
