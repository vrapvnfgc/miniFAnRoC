import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import {
	getTextDirection
	//  locales, baseLocale, cookieName
} from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { api } from '$lib/api';

const handleParaglide: Handle = ({ event, resolve }) => {
	// // Extract locale from the original request URL (before reroute removes it)
	// const fullUrl = event.request.url;
	// const urlObj = new URL(fullUrl);
	// const pathSegments = urlObj.pathname.split('/').filter(Boolean);
	// const firstSegment = pathSegments[0];

	// // Check if the first segment is a valid locale
	// const urlLocale = locales.includes(firstSegment) ? firstSegment : null;

	// // If URL has a locale, ensure it takes precedence by setting it in cookies
	// if (urlLocale) {
	// 	const currentCookies = event.request.headers.get('cookie') || '';
	// 	const newCookie = `${cookieName}=${urlLocale}; path=/; max-age=34560000; SameSite=Lax`;
	// 	event.request.headers.set('cookie', `${newCookie}; ${currentCookies}`);
	// }

	return paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});
};

const SESSION_KEY = 'session';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(SESSION_KEY);

	event.locals.user = null;

	if (sessionToken) {
		try {
			const res = await api.auth.me(sessionToken);
			event.locals.user = {
				...res.data.user,
				createdAt: new Date(res.data.user.createdAt),
				updatedAt: new Date(res.data.user.updatedAt)
			};
		} catch (error) {
			event.cookies.delete(SESSION_KEY, { path: '/' });
			console.error('Delegated auth fetch failed:', error);
		}
	}

	const path = event.url.pathname;

	if (path.startsWith('/admin')) {
		if (!event.locals.user) {
			throw redirect(303, `/auth?redirectTo=${encodeURIComponent(path)}`);
		}
		if (event.locals.user.role !== 'ADMIN') {
			throw redirect(303, '/');
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth);
