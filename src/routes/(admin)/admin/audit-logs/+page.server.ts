import type { PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async () => {
    try {
        const [logsRes, usersRes] = await Promise.all([
            api.auditLogs.getAll(),
            api.users.getAll()
        ]);
        
        return {
            logs: logsRes.data?.auditLogs || [],
            users: usersRes.data?.users || []
        };
    } catch (err) {
        console.error('Audit logs loader error:', err);
        return {
            logs: [],
            users: [],
            error: 'Could not fetch audit logs'
        };
    }
};
