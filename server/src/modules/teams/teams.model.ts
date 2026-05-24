import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamDocument extends Document<string> {
	_id: string;
	teamNumber: string;
	name: string;
	school: string;
	coach?: string;
	robotName?: string;
	members?: string[];
	createdAt: Date;
	updatedAt: Date;
}

const TeamSchema: Schema = new Schema<ITeamDocument>(
	{
		_id: { type: String, required: true },
		teamNumber: { type: String, required: true, unique: true, trim: true },
		name: { type: String, required: true, trim: true },
		school: { type: String, required: true, trim: true },
		coach: { type: String, trim: true },
		robotName: { type: String, trim: true },
		members: [{ type: String, trim: true }]
	},
	{
		timestamps: true,
		_id: false
	}
);

export const TeamModel = mongoose.model<ITeamDocument>('Team', TeamSchema);