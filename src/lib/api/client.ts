import { HttpClient } from './base';
import { TeamsService } from './teams.api';
import { FieldsService } from './fields.api';
import { MatchesService } from './matches.api';
import { ScoresService } from './scores.api';
import { RankingsService } from './rankings.api';
import { PUBLIC_BACKEND_API_URL } from '$env/static/public';

const API_BASE_URL = PUBLIC_BACKEND_API_URL || 'http://localhost:3000/api/v1';

export class APIClient {
	readonly teams: TeamsService;
	readonly fields: FieldsService;
	readonly matches: MatchesService;
	readonly scores: ScoresService;
	readonly rankings: RankingsService;

	constructor(baseUrl = API_BASE_URL) {
		const http = new HttpClient(baseUrl);

		this.teams = new TeamsService(http);
		this.fields = new FieldsService(http);
		this.matches = new MatchesService(http);
		this.scores = new ScoresService(http);
		this.rankings = new RankingsService(http);
	}
}

export const api = new APIClient();
