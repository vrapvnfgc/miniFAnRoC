export type ApiResponse<T> = {
	status: 'success';
	data: T;
};

export class HttpClient {
	constructor(private readonly baseUrl: string) {}

	private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(options.headers || {})
			}
		});

		if (response.status === 204) {
			return undefined as T;
		}

		const data = await response.json();

		if (!response.ok) {
			throw data;
		}

		return data as T;
	}

	get<T>(path: string, options: RequestInit = {}): Promise<T> {
		return this.request<T>(path, {
			...options,
			method: 'GET'
		});
	}

	post<T>(path: string, body?: unknown, options: RequestInit = {}): Promise<T> {
		return this.request<T>(path, {
			...options,
			method: 'POST',
			body: body === undefined ? undefined : JSON.stringify(body)
		});
	}

	patch<T>(path: string, body?: unknown, options: RequestInit = {}): Promise<T> {
		return this.request<T>(path, {
			...options,
			method: 'PATCH',
			body: body === undefined ? undefined : JSON.stringify(body)
		});
	}

	delete<T>(path: string, options: RequestInit = {}): Promise<T> {
		return this.request<T>(path, {
			...options,
			method: 'DELETE'
		});
	}
}

export class BaseService {
	constructor(protected readonly http: HttpClient) {}
}
