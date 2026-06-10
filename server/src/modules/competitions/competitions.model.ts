import { ICompetition } from '@shared';
import mongoose, { Schema, HydratedDocument } from 'mongoose';

export type ICompetitionDocument = HydratedDocument<ICompetition>;

const CompetitionSchema = new Schema<ICompetition>(
	{
		name: { type: String, required: true, unique: true, trim: true },
		description: { type: String, trim: true },
		nameEn: { type: String, trim: true },
		nameVi: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
		descriptionVi: { type: String, trim: true },
		status: { type: String, enum: ['upcoming', 'active', 'completed'], default: 'upcoming' },
		nextCompetitionId: { type: String },
		startDate: { type: Date },
		endDate: { type: Date }
	},
	{
		timestamps: true
	}
);

export const CompetitionModel = mongoose.model<ICompetition>('Competition', CompetitionSchema);
