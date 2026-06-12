import { Server } from 'socket.io';
import http from 'http';
import { FieldManager } from './modules/matches/field.manager';

export let fieldManager: FieldManager;

export const setupWebSocket = (server: http.Server) => {
	const io = new Server(server, {
		cors: {
			origin: '*', // For development, allow all. Should be restricted in production.
			methods: ['GET', 'POST']
		}
	});

	fieldManager = new FieldManager(io);

	io.on('connection', (socket) => {
		console.log(`Socket connected: ${socket.id}`);
		fieldManager.handleConnection(socket);

		socket.on('disconnect', () => {
			console.log(`Socket disconnected: ${socket.id}`);
		});
	});

	console.log('WebSocket Server initialized.');
};
