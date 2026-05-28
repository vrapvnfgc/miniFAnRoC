import { IField } from '@shared';
import mongoose, { Schema, HydratedDocument } from 'mongoose';

export type IFieldDocument = HydratedDocument<IField>;

const FieldSchema = new Schema<IField>(
	{
		name: { type: String, required: true, unique: true, trim: true },
		description: { type: String, trim: true },
		status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
	},
	{
		timestamps: true
	}
);

export const FieldModel = mongoose.model<IField>('Field', FieldSchema);
