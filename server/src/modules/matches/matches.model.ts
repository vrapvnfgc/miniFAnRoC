import mongoose, { Schema, HydratedDocument } from 'mongoose';

export type MatchPhase = 'qualification' | 'semifinal' | 'final';

export type MatchStatus =
	| 'queued'
	| 'scheduled'
	| 'in_progress'
	| 'finished'
	| 'terminated';

export interface IMatch {
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
}

export type IMatchDocument = HydratedDocument<IMatch>;

const MatchSchema = new Schema<IMatch>(
	{
		matchNumber: {
			type: Number,
			required: true,
			unique: true
		},

		phase: {
			type: String,
			enum: ['qualification', 'semifinal', 'final'],
			required: true
		},

		fieldId: {
			type: String,
			required: true
		},

		redTeamIds: {
			type: [String],
			required: true,
			validate: {
				validator: (value: string[]) => value.length === 2,
				message: 'Red alliance must have exactly 2 teams'
			}
		},

		blueTeamIds: {
			type: [String],
			required: true,
			validate: {
				validator: (value: string[]) => value.length === 2,
				message: 'Blue alliance must have exactly 2 teams'
			}
		},

		status: {
			type: String,
			enum: ['queued', 'scheduled', 'in_progress', 'finished', 'terminated'],
			default: 'queued'
		},

		scheduledTime: { type: Date },
		startTime: { type: Date },
		endTime: { type: Date },
		notes: { type: String, trim: true }
	},
	{
		timestamps: true
	}
);

export const MatchModel = mongoose.model<IMatch>('Match', MatchSchema);
