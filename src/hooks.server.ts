import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import {
	getTextDirection
	//  locales, baseLocale, cookieName
} from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

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

const handleAuth: Handle = async ({ event, resolve }) => {
	event.locals.user = null;
	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth);
