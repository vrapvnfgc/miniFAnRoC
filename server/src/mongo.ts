import mongoose from 'mongoose';

let connectionPromise: Promise<typeof mongoose> | undefined;

mongoose.set('bufferCommands', false);

/**
 * Lazily establishes the MongoDB pool from inside a Worker request. The pool is
 * infrastructure state (not request state) and can be reused while an isolate is warm.
 */
export async function ensureMongoConnection(uri: string): Promise<void> {
	if (mongoose.connection.readyState === 1) {
		return;
	}

	if (!connectionPromise) {
		connectionPromise = mongoose
			.connect(uri, {
				maxPoolSize: 5,
				minPoolSize: 0,
				maxIdleTimeMS: 10_000,
				serverSelectionTimeoutMS: 10_000
			})
			.catch((error: unknown) => {
				connectionPromise = undefined;
				throw error;
			});
	}

	await connectionPromise;
}
