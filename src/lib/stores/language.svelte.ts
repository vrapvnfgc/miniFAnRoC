import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { cookieName, localizeHref } from '$lib/paraglide/runtime';

type Locale = 'en' | 'vi';

function createLanguageStore() {
	let locale = $state<Locale>('vi');

	function initializeLocale(currentLocale: Locale) {
		locale = currentLocale;
	}

	async function changeLocale(newLocale: Locale) {
		if (!browser || newLocale === locale) return;

		locale = newLocale;

		document.cookie = `${cookieName}=${newLocale}; path=/; max-age=34560000; SameSite=Lax`;
		const nextUrl = localizeHref(page.url.pathname, { locale: newLocale });
		const forcedUrl = `${nextUrl}${nextUrl.includes('?') ? '&' : '?'}_=${Date.now()}`;

		await goto(forcedUrl, { invalidateAll: true, replaceState: true });
	}

	return {
		get locale() {
			return locale;
		},
		initializeLocale,
		changeLocale
	};
}

export const languageStore = createLanguageStore();
