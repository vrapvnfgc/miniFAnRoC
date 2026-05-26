import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../app';

describe('GET /api/v1/health', () => {
	it('should return 200 and server status metrics', async () => {
		const res = await request(app).get('/api/v1/health');

		expect(res.status).toBe(200);
		expect(res.body.status).toBe('success');
		expect(res.body.data.status).toBe('UP');
		expect(res.body.data.uptime).toBeTypeOf('number');
	});

	it('should return 404 for unknown endpoints in catch-all handler', async () => {
		const res = await request(app).get('/api/v1/non-existent-endpoint');

		expect(res.status).toBe(404);
		expect(res.body.status).toBe('fail');
		expect(res.body.error.code).toBe('NOT_FOUND');
	});
});
