import { httpServerHandler } from 'cloudflare:node';
import { app } from './app';
import { ensureMongoConnection } from './mongo';

export { FieldRoom } from './durable-objects/field-room';

app.listen(3000);
const expressFetch = httpServerHandler({ port: 3000 }).fetch;

if (!expressFetch) {
	throw new Error('Cloudflare Node HTTP adapter did not provide a fetch handler');
}

function jsonError(status: number, code: string, message: string): Response {
	return Response.json(
		{
			status: status >= 500 ? 'error' : 'fail',
			error: { code, message }
		},
		{ status }
	);
}

async function routeFieldSocket(request: Request, env: Env, fieldId: string): Promise<Response> {
	if (request.method !== 'GET' || request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
		return jsonError(426, 'WEBSOCKET_UPGRADE_REQUIRED', 'WebSocket upgrade required');
	}

	return env.FIELD_ROOM.getByName(fieldId).fetch(request);
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const fieldId = url.pathname.match(/^\/ws\/fields\/([0-9a-f]{24})$/i)?.[1];

		if (fieldId) {
			return routeFieldSocket(request, env, fieldId);
		}

		if (url.pathname !== '/api/v1/health') {
			if (!env.MONGO_URI || !env.JWT_SECRET) {
				return jsonError(
					503,
					'WORKER_NOT_CONFIGURED',
					'MONGO_URI and JWT_SECRET must be configured as Wrangler secrets'
				);
			}

			try {
				await ensureMongoConnection(env.MONGO_URI);
			} catch (error) {
				console.error(
					JSON.stringify({
						level: 'error',
						message: 'MongoDB connection failed',
						path: url.pathname,
						error: error instanceof Error ? error.message : String(error)
					})
				);
				return jsonError(503, 'DATABASE_UNAVAILABLE', 'Database connection is unavailable');
			}
		}

		// Worker fetch events always carry incoming-request metadata. The Node adapter's
		// current declaration is narrower than ExportedHandler's Request declaration.
		return expressFetch(
			request as Request<unknown, IncomingRequestCfProperties<unknown>>,
			env,
			ctx
		);
	}
} satisfies ExportedHandler<Env>;
