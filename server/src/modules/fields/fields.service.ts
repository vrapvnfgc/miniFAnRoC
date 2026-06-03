import { CreateField, UpdateField, FieldResponse } from '@shared';
import { AppError } from '../../core/errors';
import { FieldModel } from './fields.model';

function mapField(field: any): FieldResponse {
	return {
		id: String(field._id),
		name: field.name,
		description: field.description,
		status: field.status,
		createdAt: field.createdAt,
		updatedAt: field.updatedAt
	};
}

class FieldsService {
	async createField(data: CreateField): Promise<FieldResponse> {
		const existing = await FieldModel.findOne({ name: data.name });

		if (existing) {
			throw AppError.conflict(`Field "${data.name}" already exists`, 'FIELD_ALREADY_EXISTS');
		}

		try {
			const field = await FieldModel.create({
				name: data.name,
				description: data.description,
				status: data.status || 'ACTIVE'
			});

			return mapField(field);
		} catch (error: any) {
			if (error.code === 11000) {
				throw AppError.conflict(`Field "${data.name}" already exists`, 'FIELD_ALREADY_EXISTS');
			}

			throw error;
		}
	}

	async getAllFields(): Promise<FieldResponse[]> {
		const fields = await FieldModel.find().sort({ name: 1 });
		return fields.map(mapField);
	}

	async getActiveFields(): Promise<FieldResponse[]> {
		const fields = await FieldModel.find({ status: 'ACTIVE' }).sort({ name: 1 });
		return fields.map(mapField);
	}

	async getFieldById(id: string): Promise<FieldResponse> {
		const field = await FieldModel.findById(id);

		if (!field) {
			throw AppError.notFound(`Field with ID "${id}" could not be found`);
		}

		return mapField(field);
	}

	async updateField(id: string, data: UpdateField): Promise<FieldResponse> {
		if (data.name) {
			const existing = await FieldModel.findOne({
				name: data.name,
				_id: { $ne: id }
			});

			if (existing) {
				throw AppError.conflict(`Field "${data.name}" already exists`, 'FIELD_ALREADY_EXISTS');
			}
		}

		const field = await FieldModel.findByIdAndUpdate(id, data, {
			new: true,
			runValidators: true
		});

		if (!field) {
			throw AppError.notFound(`Field with ID "${id}" could not be found`);
		}

		return mapField(field);
	}

	async deleteField(id: string): Promise<void> {
		const field = await FieldModel.findByIdAndDelete(id);

		if (!field) {
			throw AppError.notFound(`Field with ID "${id}" could not be found`);
		}
	}
}

export const fieldsService = new FieldsService();
