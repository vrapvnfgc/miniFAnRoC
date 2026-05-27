import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { cookieName } from '$lib/paraglide/runtime';
import { page } from '$app/state';

type Locale = 'en' | 'vi';

function createLanguageStore() {
	let locale = $state<Locale>('vi');

	function initializeLocale(currentLocale: Locale) {
		locale = currentLocale;
	}

	async function changeLocale(newLocale: Locale) {
		if (!browser || newLocale === locale) return;

		locale = newLocale;

		// Set paraglide cookie directly — this is what actually switches the locale
		// because paraglide uses cookie strategy (not URL prefix in this config)
		document.cookie = `${cookieName}=${newLocale};path=/;max-age=34560000;SameSite=Lax`;

		// Reload the page to apply the new locale
		await goto(page.url.pathname, { invalidateAll: true });
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
