import type { Reroute } from '@sveltejs/kit';
import { deLocalizeUrl } from '$lib/paraglide/runtime';

export const reroute: Reroute = (request) => {
	const pathname = deLocalizeUrl(request.url).pathname;

	if (pathname === '/homepage') return '/';
	if (pathname === '/login' || pathname === '/auth') return '/register';
	if (pathname === '/competition') return '/competitions';

	return pathname;
};
