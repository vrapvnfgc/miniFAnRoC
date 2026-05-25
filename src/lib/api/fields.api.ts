import { BaseService, type ApiResponse } from './index';

export type FieldStatus = 'ACTIVE' | 'INACTIVE';

export type FieldResponse = {
	id: string;
	name: string;
	description?: string;
	status: FieldStatus;
	createdAt: string;
	updatedAt: string;
};

export type CreateField = {
	name: string;
	description?: string;
	status?: FieldStatus;
};

export type UpdateField = Partial<CreateField>;

export class FieldsService extends BaseService {
	async getAll(): Promise<ApiResponse<{ fields: FieldResponse[] }>> {
		return this.http.get<ApiResponse<{ fields: FieldResponse[] }>>('/fields');
	}

	async getActive(): Promise<ApiResponse<{ fields: FieldResponse[] }>> {
		return this.http.get<ApiResponse<{ fields: FieldResponse[] }>>('/fields/active');
	}

	async getById(id: string): Promise<ApiResponse<{ field: FieldResponse }>> {
		return this.http.get<ApiResponse<{ field: FieldResponse }>>(`/fields/${id}`);
	}

	async create(data: CreateField): Promise<ApiResponse<{ field: FieldResponse }>> {
		return this.http.post<ApiResponse<{ field: FieldResponse }>>('/fields', data);
	}

	async update(id: string, data: UpdateField): Promise<ApiResponse<{ field: FieldResponse }>> {
		return this.http.patch<ApiResponse<{ field: FieldResponse }>>(`/fields/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return this.http.delete<void>(`/fields/${id}`);
	}
}

export const fieldsApi = new FieldsService();
