import mongoose, { Schema, HydratedDocument } from 'mongoose';

export interface IField {
	_id: string;
	name: string;
	description?: string;
	status: 'ACTIVE' | 'INACTIVE';
	createdAt: Date;
	updatedAt: Date;
}

export type IFieldDocument = HydratedDocument<IField>;

const FieldSchema = new Schema<IField>(
	{
		_id: { type: String, required: true },
		name: { type: String, required: true, unique: true, trim: true },
		description: { type: String, trim: true },
		status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
	},
	{
		timestamps: true,
		_id: false
	}
);

export const FieldModel = mongoose.model<IField>('Field', FieldSchema);