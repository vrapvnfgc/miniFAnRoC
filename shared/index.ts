import { z } from 'zod';

const userRoles = ['USER', 'ADMIN'] as const;

export type UserRoles = (typeof userRoles)[number];

export const UserSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email('Invalid email address'),
	name: z.string().min(2, 'Name must be at least 2 characters long'),
	role: z.enum(userRoles).default('USER'),
	createdAt: z.date(),
	updatedAt: z.date()
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
	email: z.string().email('Invalid email address'),
	name: z.string().min(2, 'Name must be at least 2 characters long'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
	role: z.enum(userRoles).optional()
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial()
	.omit({ role: true })
	.extend({
		name: z.string().min(2).optional()
	});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const UserResponseSchema = UserSchema.extend({
	createdAt: z.string().or(z.date()),
	updatedAt: z.string().or(z.date())
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
