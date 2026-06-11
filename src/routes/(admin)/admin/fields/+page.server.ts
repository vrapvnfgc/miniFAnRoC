import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { api } from '$lib/api';

export const load: PageServerLoad = async () => {
    try {
        const [fieldsRes, competitionsRes] = await Promise.all([api.fields.getAll(), api.competitions.getAll()]);
        return {
            fields: fieldsRes.data?.fields || [],
            competitions: competitionsRes.data?.competitions || []
        };
    } catch (err) {
        console.error('Fields loader error:', err);
        return {
            fields: [],
            competitions: [],
            error: 'Could not fetch fields'
        };
    }
};

export const actions: Actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name');
        const description = data.get('description');
        const status = data.get('status');
        const competitionId = data.get('competitionId');

        if (!name) {
            return fail(400, { missing: true, type: 'create' });
        }

        try {
            await api.fields.create({
                name: name.toString(),
                description: description?.toString() || undefined,
                competitionId: competitionId?.toString() || undefined,
                status: status?.toString() as any
            });

            return { success: true, type: 'create' };
        } catch (err) {
            console.error('Create field error:', err);
            const apiError = err as { error?: { message?: string } };
            return fail(400, {
                success: false,
                error: apiError?.error?.message || 'Failed to create field',
                type: 'create'
            });
        }
    },

    update: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');
        const name = data.get('name');
        const description = data.get('description');
        const status = data.get('status');
        const competitionId = data.get('competitionId');

        if (!id || !name) {
            return fail(400, { missing: true, type: 'update' });
        }

        try {
            await api.fields.update(id.toString(), {
                name: name.toString(),
                description: description?.toString() || undefined,
                competitionId: competitionId?.toString() || undefined,
                status: status?.toString() as any
            });

            return { success: true, type: 'update' };
        } catch (err) {
            console.error('Update field error:', err);
            const apiError = err as { error?: { message?: string } };
            return fail(400, {
                success: false,
                error: apiError?.error?.message || 'Failed to update field',
                type: 'update'
            });
        }
    },

    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');

        if (!id) {
            return fail(400, { missing: true, type: 'delete' });
        }

        try {
            await api.fields.delete(id.toString());
            return { success: true, type: 'delete' };
        } catch (err) {
            console.error('Delete field error:', err);
            const apiError = err as { error?: { message?: string } };
            return fail(400, {
                success: false,
                error: apiError?.error?.message || 'Failed to delete field',
                type: 'delete'
            });
        }
    }
};
