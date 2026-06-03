import { CreateCompetition, UpdateCompetition, CompetitionResponse } from '@shared';
import { AppError } from '../../core/errors';
import { CompetitionModel } from './competitions.model';

function mapCompetition(comp: any): CompetitionResponse {
	return {
		id: String(comp._id),
		name: comp.name,
		description: comp.description,
		status: comp.status,
		startDate: comp.startDate,
		endDate: comp.endDate,
		createdAt: comp.createdAt,
		updatedAt: comp.updatedAt
	};
}

class CompetitionsService {
	async createCompetition(data: CreateCompetition): Promise<CompetitionResponse> {
		const existing = await CompetitionModel.findOne({ name: data.name });

		if (existing) {
			throw AppError.conflict(
				`Competition name "${data.name}" already exists`,
				'COMPETITION_NAME_ALREADY_EXISTS'
			);
		}

		try {
			const comp = await CompetitionModel.create(data);
			return mapCompetition(comp);
		} catch (error: any) {
			if (error.code === 11000) {
				throw AppError.conflict(
					`Competition name "${data.name}" already exists`,
					'COMPETITION_NAME_ALREADY_EXISTS'
				);
			}
			throw error;
		}
	}

	async getAllCompetitions(): Promise<CompetitionResponse[]> {
		const comps = await CompetitionModel.find().sort({ createdAt: -1 });
		return comps.map(mapCompetition);
	}

	async getCompetitionById(id: string): Promise<CompetitionResponse> {
		const comp = await CompetitionModel.findById(id);

		if (!comp) {
			throw AppError.notFound(`Competition with ID "${id}" could not be found`);
		}

		return mapCompetition(comp);
	}

	async updateCompetition(id: string, data: UpdateCompetition): Promise<CompetitionResponse> {
		const current = await CompetitionModel.findById(id);

		if (!current) {
			throw AppError.notFound(`Competition with ID "${id}" could not be found`);
		}

		if (data.name) {
			const existing = await CompetitionModel.findOne({
				name: data.name,
				_id: { $ne: id }
			});

			if (existing) {
				throw AppError.conflict(
					`Competition name "${data.name}" already exists`,
					'COMPETITION_NAME_ALREADY_EXISTS'
				);
			}
		}

		Object.assign(current, data);

		const updated = await current.save();

		return mapCompetition(updated);
	}

	async deleteCompetition(id: string): Promise<void> {
		const comp = await CompetitionModel.findByIdAndDelete(id);

		if (!comp) {
			throw AppError.notFound(`Competition with ID "${id}" could not be found`);
		}
	}
}

export const competitionsService = new CompetitionsService();
