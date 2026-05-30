import express from 'express';
import cors from 'cors';
import { requestLogger, errorHandler } from './core/middlewares';
import { AppError } from './core/errors';
import { healthRouter } from './modules/health/health.routes';
import { usersRouter } from './modules/users/users.routes';
import { teamsRouter } from './modules/teams/teams.routes';
import { fieldsRouter } from './modules/fields/fields.routes';
import { matchesRouter } from './modules/matches/matches.routes';
import { scoresRouter } from './modules/scores/scores.routes';
import { rankingsRouter } from './modules/rankings/rankings.routes';
import { authRouter } from './modules/auth/auth.routes';
import { competitionsRouter } from './modules/competitions/competitions.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/v1/health', healthRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/teams', teamsRouter);
app.use('/api/v1/fields', fieldsRouter);
app.use('/api/v1/matches', matchesRouter);
app.use('/api/v1/matches', scoresRouter);
app.use('/api/v1/rankings', rankingsRouter);
app.use('/api/v1/competitions', competitionsRouter);

if (process.env.NODE_ENV === 'production') {
	try {
		const handlerPath = './sveltekit/handler.js';
		const { handler } = await import(handlerPath);
		app.use(handler);
	} catch (error) {
		console.error('Failed to load SvelteKit handler:', error);
	}
}

app.use((req, _res, next) => {
	next(AppError.notFound(`endpoint not found: ${req.method} ${req.path}`));
});

app.use(errorHandler);

export { app };
