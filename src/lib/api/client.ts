import { HttpClient } from '.';
import { UserService } from './user.api';
import { HealthService } from './health.api';

export class APIClient {
	private http: HttpClient;
	public health: HealthService;
	public user: UserService;

	constructor(baseUrl?: string) {
		this.http = new HttpClient(baseUrl);
		this.health = new HealthService(this.http);
		this.user = new UserService(this.http);
	}
}
