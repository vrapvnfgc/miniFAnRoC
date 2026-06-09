import { ITeam } from '@shared';
import mongoose, { Schema, HydratedDocument } from 'mongoose';

export type ITeamDocument = HydratedDocument<ITeam>;

const TeamSchema = new Schema<ITeam>(
	{
		teamNumber: { type: String, required: true, unique: true, trim: true },
		competitionIds: { type: [String], default: [] },
		name: { type: String, required: true, trim: true },
		school: { type: String, required: true, trim: true },
		location: { type: String, trim: true },
		representativeEmail: { type: String, trim: true, lowercase: true },
		representativePhone: { type: String, trim: true },
		coach: { type: String, trim: true },
		teacherName: { type: String, trim: true },
		teacherEmail: { type: String, trim: true, lowercase: true },
		teacherPhone: { type: String, trim: true },
		robotName: { type: String, trim: true },
		members: [{ type: String, trim: true }],
		memberDetails: [
			{
				_id: false,
				name: { type: String, required: true, trim: true },
				className: { type: String, required: true, trim: true }
			}
		]
	},
	{
		timestamps: true
	}
);

export const TeamModel = mongoose.model<ITeam>('Team', TeamSchema);
