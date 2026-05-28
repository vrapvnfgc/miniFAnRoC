import mongoose from 'mongoose';
import { app } from './app';
import { config } from './config';
import { usersService } from './modules/users/users.service';

const startServer = async () => {
	try {
		console.log('connecting to MongoDB...');
		await mongoose.connect(config.mongoUri);
		console.log('connected to MongoDB successfully');

		await usersService.seedAdminUser();

		app.listen(config.port, () => {
			console.log(`=========================================`);
			console.log(`  server starting in [${config.nodeEnv}] mode`);
			console.log(`  listening on: http://localhost:${config.port}`);
			console.log(`=========================================`);
		});
	} catch (error) {
		console.error('fatal error starting Express server:', error);
		process.exit(1);
	}
};

startServer();
