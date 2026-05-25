/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIClient } from './client';

export interface ApiResponse<T> {
	status: 'success' | 'fail' | 'error';
	data?: T;
	error?: {
		code: string;
		message: string;
		details?: any;
	};
}

export class APIError extends Error {
	constructor(
		public statusCode: number,
		public code: string,
		message: string,
		public details?: any
	) {
		super(message);
		this.name = 'APIError';
	}
}

export class HttpClient {
	private baseUrl: string;

	constructor(baseUrl?: string) {
		this.baseUrl = baseUrl || (typeof window !== 'undefined' ? '/api/v1' : 'http://localhost:3000/api/v1');
	}

	async request<T>(path: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUrl}${path}`;
		const headers = {
			'Content-Type': 'application/json',
			...options.headers
		};

		const response = await fetch(url, {
			...options,
			headers
		});

		let body: any;
		try {
			body = await response.json();
		} catch {
			body = null;
		}

		if (!response.ok) {
			const errorMsg = body?.error?.message || response.statusText;
			const errorCode = body?.error?.code || 'HTTP_ERROR';
			const errorDetails = body?.error?.details || null;
			throw new APIError(response.status, errorCode, errorMsg, errorDetails);
		}

		return body;
	}

	get<T>(path: string, options?: RequestInit): Promise<T> {
		return this.request<T>(path, { ...options, method: 'GET' });
	}

	post<T>(path: string, data?: any, options?: RequestInit): Promise<T> {
		return this.request<T>(path, {
			...options,
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined
		});
	}
}

export class BaseService {
	protected http: HttpClient;

	constructor(http: HttpClient) {
		this.http = http;
	}
}

export const api = new APIClient();
