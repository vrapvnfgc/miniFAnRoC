import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		const redirectTo = url.searchParams.get('redirectTo') || '/';
		throw redirect(303, redirectTo);
	}
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !password) {
			return fail(400, { success: false, error: 'Email and password are required' });
		}

		try {
			const res = await api.auth.login({
				email: email.toString(),
				password: password.toString()
			});

			const { token } = res.data;

			cookies.set('session', token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24
			});
		} catch (err) {
			console.error('Login action error:', err);
			const apiError = err as { error?: { message?: string } };
			const errorMessage = apiError?.error?.message || 'Connection to authentication server failed';
			return fail(401, { success: false, error: errorMessage });
		}

		const redirectTo = url.searchParams.get('redirectTo') || '/';
		throw redirect(303, redirectTo);
	},

	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		throw redirect(303, '/auth');
	}
};
