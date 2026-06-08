import { CreateTeam, UpdateTeam, TeamResponse } from '@shared';
import { AppError } from '../../core/errors';
import { TeamModel } from './teams.model';

function mapTeam(team: any): TeamResponse {
	return {
		id: String(team._id),
		teamNumber: team.teamNumber,
		competitionIds: team.competitionIds || [],
		name: team.name,
		school: team.school,
		coach: team.coach,
		robotName: team.robotName,
		members: team.members,
		createdAt: team.createdAt,
		updatedAt: team.updatedAt
	};
}

class TeamsService {
	async createTeam(data: CreateTeam): Promise<TeamResponse> {
		const existing = await TeamModel.findOne({ teamNumber: data.teamNumber });

		if (existing) {
			throw AppError.conflict(
				`Team number "${data.teamNumber}" already exists`,
				'TEAM_NUMBER_ALREADY_EXISTS'
			);
		}

		try {
			const team = await TeamModel.create({
				teamNumber: data.teamNumber,
				competitionIds: data.competitionIds || [],
				name: data.name,
				school: data.school,
				coach: data.coach,
				robotName: data.robotName,
				members: data.members || []
			});

			return mapTeam(team);
		} catch (error: any) {
			if (error.code === 11000) {
				throw AppError.conflict(
					`Team number "${data.teamNumber}" already exists`,
					'TEAM_NUMBER_ALREADY_EXISTS'
				);
			}

			throw error;
		}
	}

	async getAllTeams(): Promise<TeamResponse[]> {
		const teams = await TeamModel.find().sort({ teamNumber: 1 });
		return teams.map(mapTeam);
	}

	async getTeamById(id: string): Promise<TeamResponse> {
		const team = await TeamModel.findById(id);

		if (!team) {
			throw AppError.notFound(`Team with ID "${id}" could not be found`);
		}

		return mapTeam(team);
	}

	async updateTeam(id: string, data: UpdateTeam): Promise<TeamResponse> {
		if (data.teamNumber) {
			const existing = await TeamModel.findOne({
				teamNumber: data.teamNumber,
				_id: { $ne: id }
			});

			if (existing) {
				throw AppError.conflict(
					`Team number "${data.teamNumber}" already exists`,
					'TEAM_NUMBER_ALREADY_EXISTS'
				);
			}
		}

		const team = await TeamModel.findByIdAndUpdate(id, data, {
			new: true,
			runValidators: true
		});

		if (!team) {
			throw AppError.notFound(`Team with ID "${id}" could not be found`);
		}

		return mapTeam(team);
	}

	async deleteTeam(id: string): Promise<void> {
		const team = await TeamModel.findByIdAndDelete(id);

		if (!team) {
			throw AppError.notFound(`Team with ID "${id}" could not be found`);
		}
	}
}

export const teamsService = new TeamsService();
