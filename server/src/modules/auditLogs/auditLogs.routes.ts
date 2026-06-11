import { Router, Request, Response, NextFunction } from 'express';
import { auditLogsService } from './auditLogs.service';
import { requireAdmin } from '../../core/auth.middleware';

const router = Router();

router.get('/', requireAdmin, getAllAuditLogsHandler);

export { router as auditLogsRouter };

async function getAllAuditLogsHandler(_req: Request, res: Response, next: NextFunction) {
	try {
		const auditLogs = await auditLogsService.getAllAuditLogs();
		res.status(200).json({
			status: 'success',
			data: { auditLogs }
		});
	} catch (error) {
		next(error);
	}
}
