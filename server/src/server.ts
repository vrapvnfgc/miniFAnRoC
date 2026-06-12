import mongoose from 'mongoose';
import { app } from './app';
import { config } from './config';
import { usersService } from './modules/users/users.service';
import { seedDemoData } from './seed/demoData';
import { createServer } from 'http';
import { setupWebSocket } from './ws';

const startServer = async () => {
	try {
		console.log('connecting to MongoDB...');
		await mongoose.connect(config.mongoUri);
		console.log('connected to MongoDB successfully');

		await usersService.seedAdminUser();

		if (config.seedDemoData) {
			await seedDemoData();
		}

		const server = createServer(app);
		setupWebSocket(server);

		server.listen(config.port, '0.0.0.0', () => {
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
