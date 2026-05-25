import mongoose, { Schema, HydratedDocument } from 'mongoose';

export type ScoreStatus = 'draft' | 'submitted' | 'finalized';

export interface IAllianceScore {
	teleIndependent: number;
	sharedScore: number;
	penalties: number;
	endgame: number;
	endgameMultiplier: number;
	total: number;
}

export interface IMatchScore {
	matchId: string;
	red: IAllianceScore;
	blue: IAllianceScore;
	status: ScoreStatus;
	submittedAt?: Date;
	finalizedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export type IMatchScoreDocument = HydratedDocument<IMatchScore>;

const AllianceScoreSchema = new Schema<IAllianceScore>(
	{
		teleIndependent: { type: Number, required: true, default: 0 },
		sharedScore: { type: Number, required: true, default: 0 },
		penalties: { type: Number, required: true, default: 0 },
		endgame: { type: Number, required: true, default: 0 },
		endgameMultiplier: { type: Number, required: true, default: 1 },
		total: { type: Number, required: true, default: 0 }
	},
	{ _id: false }
);

const MatchScoreSchema = new Schema<IMatchScore>(
	{
		matchId: {
			type: String,
			required: true,
			unique: true
		},

		red: {
			type: AllianceScoreSchema,
			required: true
		},

		blue: {
			type: AllianceScoreSchema,
			required: true
		},

		status: {
			type: String,
			enum: ['draft', 'submitted', 'finalized'],
			default: 'draft'
		},

		submittedAt: { type: Date },
		finalizedAt: { type: Date }
	},
	{
		timestamps: true
	}
);

export const MatchScoreModel = mongoose.model<IMatchScore>('MatchScore', MatchScoreSchema);
