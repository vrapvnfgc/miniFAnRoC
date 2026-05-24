import express from 'express';
import cors from 'cors';
import { requestLogger, errorHandler } from './core/middlewares';
import { AppError } from './core/errors';
import { healthRouter } from './modules/health/health.routes';
import { usersRouter } from './modules/users/users.routes';
import { teamsRouter } from './modules/teams/teams.routes';
const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/v1/health', healthRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/teams', teamsRouter);
app.use((req, _res, next) => {
	next(AppError.notFound(`endpoint not found: ${req.method} ${req.path}`));
});

app.use(errorHandler);

export { app };
