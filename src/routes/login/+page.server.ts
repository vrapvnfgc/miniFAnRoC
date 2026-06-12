import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/admin');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		try {
			const res = await api.auth.login({ email, password });
			if (res.data?.token) {
				cookies.set('session', res.data.token, {
					path: '/',
					maxAge: 60 * 60 * 24, // 24 hours
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax'
				});

				const redirectTo = url.searchParams.get('redirectTo') || '/admin';
				throw redirect(303, redirectTo);
			}
			return fail(401, { error: 'Invalid credentials' });
		} catch (err: any) {
			if (err?.status === 303) throw err; // rethrow redirect
			const errorMessage = err?.response?.data?.message || err?.error?.message || 'Login failed';
			return fail(401, { error: errorMessage });
		}
	}
};
