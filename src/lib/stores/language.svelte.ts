import { browser } from '$app/environment';
import { invalidateAll } from '$app/navigation';
import { cookieName } from '$lib/paraglide/runtime';

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

		// Invalidate all load functions so SSR re-runs with new locale
		await invalidateAll();
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
