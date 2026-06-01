import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: 'Admin' | 'Head Referee' | 'Scorekeeper' | 'Spectator'; // Khớp chuẩn phân vai giải đấu [cite: 68]
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['Admin', 'Head Referee', 'Scorekeeper', 'Spectator'],
      default: 'Spectator',
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);