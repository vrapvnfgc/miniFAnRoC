import { CreateUser, UserResponse } from '@shared';
import { AppError } from '../../core/errors';
import crypto from 'crypto';
import { UserModel } from './users.model';

function mapUser(user: any): UserResponse {
	return {
		id: user._id,
		email: user.email,
		name: user.name,
		role: user.role,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt
	};
}

class UsersService {
	async createUser(data: CreateUser): Promise<UserResponse> {
		const existing = await UserModel.findOne({ email: data.email.toLowerCase() });
		if (existing) {
			throw AppError.conflict(
				'A user with this email address already exists',
				'EMAIL_ALREADY_EXISTS'
			);
		}

		const passwordHash = crypto.createHash('sha256').update(data.password).digest('hex');
		const id = crypto.randomUUID();

		try {
			const user = await UserModel.create({
				_id: id,
				email: data.email,
				name: data.name,
				role: data.role || 'USER',
				passwordHash
			});

			return mapUser(user);
		} catch (error: any) {
			if (error.code === 11000) {
				throw AppError.conflict(
					'A user with this email address already exists',
					'EMAIL_ALREADY_EXISTS'
				);
			}
			throw error;
		}
	}

	async getUserById(id: string): Promise<UserResponse> {
		const user = await UserModel.findById(id);
		if (!user) {
			throw AppError.notFound(`User with ID "${id}" could not be found`);
		}

		return mapUser(user);
	}

	async getAllUsers(): Promise<UserResponse[]> {
		const users = await UserModel.find();
		return users.map(mapUser);
	}
}

export const usersService = new UsersService();
