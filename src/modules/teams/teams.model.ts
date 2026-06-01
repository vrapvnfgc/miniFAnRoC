import { Schema, model, Document } from 'mongoose';

export interface ITeam extends Document {
  teamNumber: string;
  teamName: string;
  school: string;
  coach: string;
  robotName?: string;
  members?: string[];
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    teamNumber: {
      type: String,
      required: [true, 'Số hiệu đội thi là bắt buộc'],
      unique: true,
      trim: true,
    },
    teamName: {
      teamName: {
      type: String,
      required: [true, 'Tên đội thi là bắt buộc'],
      unique: true, 
      trim: true,
    },
    },
    school: {
      type: String,
      required: [true, 'Tên trường/tổ chức là bắt buộc'],
      trim: true,
    },
    coach: {
      type: String,
      required: [true, 'Tên huấn luyện viên là bắt buộc'],
      trim: true,
    },
    robotName: { type: String, default: '' },
    members: { type: [String], default: [] },
    avatarUrl: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const Team = model<ITeam>('Team', TeamSchema);