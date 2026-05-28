import { browser } from '$app/environment';
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
		
		// Use location.href for a full page reload to ensure Paraglide middleware updates the locale
		window.location.href = nextUrl;
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
