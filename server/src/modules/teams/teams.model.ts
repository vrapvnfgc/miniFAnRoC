import { ITeam } from '@shared';
import mongoose, { Schema, HydratedDocument } from 'mongoose';

export type ITeamDocument = HydratedDocument<ITeam>;

const TeamSchema = new Schema<ITeam>(
	{
		teamNumber: { type: String, required: true, unique: true, trim: true },
		name: { type: String, required: true, trim: true },
		school: { type: String, required: true, trim: true },
		coach: { type: String, trim: true },
		robotName: { type: String, trim: true },
		members: [{ type: String, trim: true }]
	},
	{
		timestamps: true
	}
);

export const TeamModel = mongoose.model<ITeam>('Team', TeamSchema);
