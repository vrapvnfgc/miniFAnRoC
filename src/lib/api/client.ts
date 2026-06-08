import { HttpClient } from './base';
import { TeamsService } from './teams.api';
import { FieldsService } from './fields.api';
import { MatchesService } from './matches.api';
import { ScoresService } from './scores.api';
import { AuthService } from './auth.api';
import { UserService } from './user.api';
import { CompetitionsService } from './competitions.api';
import { env } from '$env/dynamic/public';

const API_BASE_URL = env.PUBLIC_BACKEND_API_URL || 'http://localhost:3000/api/v1';

export class APIClient {
	readonly teams: TeamsService;
	readonly fields: FieldsService;
	readonly matches: MatchesService;
	readonly scores: ScoresService;
	readonly auth: AuthService;
	readonly users: UserService;
	readonly competitions: CompetitionsService;

	constructor(baseUrl = API_BASE_URL) {
		const http = new HttpClient(baseUrl);

		this.teams = new TeamsService(http);
		this.fields = new FieldsService(http);
		this.matches = new MatchesService(http);
		this.scores = new ScoresService(http);
		this.auth = new AuthService(http);
		this.users = new UserService(http);
		this.competitions = new CompetitionsService(http);
	}
}

export const api = new APIClient();
