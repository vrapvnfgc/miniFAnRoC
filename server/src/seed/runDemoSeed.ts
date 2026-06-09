import mongoose from 'mongoose';
import { config } from '../config';
import { seedDemoData } from './demoData';

try {
	console.log('[Seed] Connecting to MongoDB...');
	await mongoose.connect(config.mongoUri);
	await seedDemoData();
	console.log('[Seed] Demo seed completed');
	await mongoose.connection.close();
} catch (error) {
	console.error('[Seed] Demo seed failed:', error);
	await mongoose.connection.close();
	process.exit(1);
}
