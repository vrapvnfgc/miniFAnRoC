import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document<string> {
  _id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUserDocument>(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: true,
    _id: false,
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
