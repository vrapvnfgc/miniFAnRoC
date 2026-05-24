import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../core/middlewares';
import { fieldsService } from './fields.service';

const router = Router();

const FieldIdParamSchema = z.object({
	id: z.string().uuid('Field ID must be a valid UUID format')
});

const CreateFieldSchema = z.object({
	name: z.string().min(1, 'Field name is required'),
	description: z.string().optional(),
	status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
	currentMatchId: z.string().uuid().nullable().optional(),
	location: z.string().optional(),
	capacity: z.number().int().positive().optional()
});

const UpdateFieldSchema = CreateFieldSchema.partial();

router.post('/', validate({ body: CreateFieldSchema }), createFieldHandler);
router.get('/', getAllFieldsHandler);
router.get('/active', getActiveFieldsHandler);
router.get('/:id', validate({ params: FieldIdParamSchema }), getFieldByIdHandler);
router.patch(
	'/:id',
	validate({ params: FieldIdParamSchema, body: UpdateFieldSchema }),
	updateFieldHandler
);
router.delete('/:id', validate({ params: FieldIdParamSchema }), deleteFieldHandler);

export { router as fieldsRouter };

async function createFieldHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const field = await fieldsService.createField(req.body);

		res.status(201).json({
			status: 'success',
			data: { field }
		});
	} catch (error) {
		next(error);
	}
}

async function getAllFieldsHandler(_req: Request, res: Response, next: NextFunction) {
	try {
		const fields = await fieldsService.getAllFields();

		res.status(200).json({
			status: 'success',
			data: { fields }
		});
	} catch (error) {
		next(error);
	}
}

async function getActiveFieldsHandler(_req: Request, res: Response, next: NextFunction) {
	try {
		const fields = await fieldsService.getActiveFields();

		res.status(200).json({
			status: 'success',
			data: { fields }
		});
	} catch (error) {
		next(error);
	}
}

async function getFieldByIdHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const field = await fieldsService.getFieldById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: { field }
		});
	} catch (error) {
		next(error);
	}
}

async function updateFieldHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const field = await fieldsService.updateField(req.params.id, req.body);

		res.status(200).json({
			status: 'success',
			data: { field }
		});
	} catch (error) {
		next(error);
	}
}

async function deleteFieldHandler(req: Request, res: Response, next: NextFunction) {
	try {
		await fieldsService.deleteField(req.params.id);

		res.status(204).send();
	} catch (error) {
		next(error);
	}
}