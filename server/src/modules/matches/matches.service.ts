import crypto from 'crypto';
import { AppError } from '../../core/errors';
import { MatchModel, MatchPhase, MatchStatus } from './matches.model';
import { TeamModel } from '../teams/teams.model';
import { FieldModel } from '../fields/fields.model';

export type CreateMatch = {
	matchNumber: number;
	phase: MatchPhase;
	fieldId: string;
	redTeamIds: string[];
	blueTeamIds: string[];
	status?: MatchStatus;
	scheduledTime?: string | Date;
	startTime?: string | Date;
	endTime?: string | Date;
	notes?: string;
};

export type UpdateMatch = Partial<CreateMatch>;

export type MatchResponse = {
	id: string;
	matchNumber: number;
	phase: MatchPhase;
	fieldId: string;
	redTeamIds: string[];
	blueTeamIds: string[];
	status: MatchStatus;
	scheduledTime?: Date;
	startTime?: Date;
	endTime?: Date;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
};

function mapMatch(match: any): MatchResponse {
	return {
		id: match._id,
		matchNumber: match.matchNumber,
		phase: match.phase,
		fieldId: match.fieldId,
		redTeamIds: match.redTeamIds,
		blueTeamIds: match.blueTeamIds,
		status: match.status,
		scheduledTime: match.scheduledTime,
		startTime: match.startTime,
		endTime: match.endTime,
		notes: match.notes,
		createdAt: match.createdAt,
		updatedAt: match.updatedAt
	};
}

async function validateMatchReferences(fieldId: string, redTeamIds: string[], blueTeamIds: string[]) {
	const field = await FieldModel.findById(fieldId);

	if (!field) {
		throw AppError.notFound(`Field with ID "${fieldId}" could not be found`);
	}

	const allTeamIds = [...redTeamIds, ...blueTeamIds];
	const uniqueTeamIds = [...new Set(allTeamIds)];

	if (uniqueTeamIds.length !== allTeamIds.length) {
		throw AppError.badRequest('A team cannot appear more than once in the same match', 'DUPLICATE_TEAM_IN_MATCH');
	}

	const existingTeamsCount = await TeamModel.countDocuments({
		_id: { $in: uniqueTeamIds }
	});

	if (existingTeamsCount !== uniqueTeamIds.length) {
		throw AppError.badRequest('One or more team IDs are invalid', 'INVALID_TEAM_IDS');
	}
}

class MatchesService {
	async createMatch(data: CreateMatch): Promise<MatchResponse> {
		const existing = await MatchModel.findOne({ matchNumber: data.matchNumber });

		if (existing) {
			throw AppError.conflict(
				`Match number "${data.matchNumber}" already exists`,
				'MATCH_NUMBER_ALREADY_EXISTS'
			);
		}

		await validateMatchReferences(data.fieldId, data.redTeamIds, data.blueTeamIds);

		const id = crypto.randomUUID();

		try {
			const match = await MatchModel.create({
				_id: id,
				matchNumber: data.matchNumber,
				phase: data.phase,
				fieldId: data.fieldId,
				redTeamIds: data.redTeamIds,
				blueTeamIds: data.blueTeamIds,
				status: data.status || 'queued',
				scheduledTime: data.scheduledTime,
				startTime: data.startTime,
				endTime: data.endTime,
				notes: data.notes
			});

			return mapMatch(match);
		} catch (error: any) {
			if (error.code === 11000) {
				throw AppError.conflict(
					`Match number "${data.matchNumber}" already exists`,
					'MATCH_NUMBER_ALREADY_EXISTS'
				);
			}

			throw error;
		}
	}

	async getAllMatches(): Promise<MatchResponse[]> {
		const matches = await MatchModel.find().sort({ matchNumber: 1 });
		return matches.map(mapMatch);
	}

	async getMatchById(id: string): Promise<MatchResponse> {
		const match = await MatchModel.findById(id);

		if (!match) {
			throw AppError.notFound(`Match with ID "${id}" could not be found`);
		}

		return mapMatch(match);
	}

	async updateMatch(id: string, data: UpdateMatch): Promise<MatchResponse> {
		const currentMatch = await MatchModel.findById(id);

		if (!currentMatch) {
			throw AppError.notFound(`Match with ID "${id}" could not be found`);
		}

		if (data.matchNumber) {
			const existing = await MatchModel.findOne({
				matchNumber: data.matchNumber,
				_id: { $ne: id }
			});

			if (existing) {
				throw AppError.conflict(
					`Match number "${data.matchNumber}" already exists`,
					'MATCH_NUMBER_ALREADY_EXISTS'
				);
			}
		}

		const nextFieldId = data.fieldId || currentMatch.fieldId;
		const nextRedTeamIds = data.redTeamIds || currentMatch.redTeamIds;
		const nextBlueTeamIds = data.blueTeamIds || currentMatch.blueTeamIds;

		await validateMatchReferences(nextFieldId, nextRedTeamIds, nextBlueTeamIds);

		Object.assign(currentMatch, data);

		const updatedMatch = await currentMatch.save();

		return mapMatch(updatedMatch);
	}

	async deleteMatch(id: string): Promise<void> {
		const match = await MatchModel.findByIdAndDelete(id);

		if (!match) {
			throw AppError.notFound(`Match with ID "${id}" could not be found`);
		}
	}
}

export const matchesService = new MatchesService(); 