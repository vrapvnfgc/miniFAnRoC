import { CreateUser, UserResponse } from '@shared';
import { AppError } from '../../core/errors';
import crypto, { webcrypto } from 'crypto';
import { UserModel } from './users.model';
import { config } from '../../config';

const { subtle } = webcrypto;

const ITERATIONS = 100000;
const KEY_LEN = 32;
const HASH_ALG = 'SHA-256';

export async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const salt = crypto.randomBytes(16);
	const baseKey = await subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
		'deriveBits'
	]);
	const derivedBits = await subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: ITERATIONS,
			hash: HASH_ALG
		},
		baseKey,
		KEY_LEN * 8
	);

	const hashBuffer = new Uint8Array(derivedBits);
	const saltHex = Buffer.from(salt).toString('hex');
	const hashHex = Buffer.from(hashBuffer).toString('hex');

	return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
	const parts = storedHash.split(':');
	if (parts.length !== 2) {
		// Fallback for old SHA-256 hashes if they exist
		const sha256Fallback = crypto.createHash('sha256').update(password).digest('hex');
		return storedHash === sha256Fallback;
	}

	const [saltHex, hashHex] = parts;
	const salt = Buffer.from(saltHex, 'hex');
	const encoder = new TextEncoder();
	const baseKey = await subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
		'deriveBits'
	]);
	const derivedBits = await subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: ITERATIONS,
			hash: HASH_ALG
		},
		baseKey,
		KEY_LEN * 8
	);

	const hashBuffer = new Uint8Array(derivedBits);
	const derivedHex = Buffer.from(hashBuffer).toString('hex');

	return crypto.timingSafeEqual(Buffer.from(hashHex, 'hex'), Buffer.from(derivedHex, 'hex'));
}

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

		const passwordHash = await hashPassword(data.password);

		try {
			const user = await UserModel.create({
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

	async getUserByEmail(email: string): Promise<any> {
		return UserModel.findOne({ email: email.toLowerCase() });
	}

	async getAllUsers(): Promise<UserResponse[]> {
		const users = await UserModel.find();
		return users.map(mapUser);
	}

	async seedAdminUser(): Promise<void> {
		const adminEmail = config.adminEmail;
		const adminPassword = config.adminPassword;

		const existingAdmin = await UserModel.findOne({ email: adminEmail.toLowerCase() });
		if (!existingAdmin) {
			const passwordHash = await hashPassword(adminPassword);
			await UserModel.create({
				email: adminEmail,
				name: 'Root Admin',
				role: 'ADMIN',
				passwordHash
			});
			console.log(`[Seed] Seeded root admin user with email: ${adminEmail}`);
		} else {
			console.log(`[Seed] Root admin user (${adminEmail}) already exists`);
		}
	}
}

export const usersService = new UsersService();
