import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

export const config = {
	port: parseInt(process.env.PORT || '3000', 10),
	nodeEnv: process.env.NODE_ENV || 'development',
	isDev: (process.env.NODE_ENV || 'development') === 'development',
	mongoUri:
		process.env.MONGO_URI || 'mongodb://user:password@localhost:27017/miniFanRoC?authSource=admin',
	jwtSecret: process.env.JWT_SECRET || 'super-secret-dev-key-12345-abcde',
	adminEmail: process.env.ADMIN_EMAIL || 'admin@minifanroc.com',
	adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
	seedDemoData:
		(process.env.NODE_ENV || 'development') !== 'production' &&
		process.env.SEED_DEMO_DATA !== 'false'
};
