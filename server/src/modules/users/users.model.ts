import { User } from '@shared';
import mongoose, { Schema, Types } from 'mongoose';

export interface IUserDocument extends Omit<User, 'id'> {
	_id: Types.ObjectId;
	passwordHash: string;
}

const UserSchema: Schema = new Schema<IUserDocument>(
	{
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		name: { type: String, required: true },
		role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
		passwordHash: { type: String, required: true }
	},
	{
		timestamps: true
	}
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
