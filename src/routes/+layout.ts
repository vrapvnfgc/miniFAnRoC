import type { LayoutLoad } from './$types';
import { languageStore } from '$lib/stores/language.svelte';
import { themeStore } from '$lib/stores/theme.svelte';

export const load: LayoutLoad = async ({ data }) => {
	// Initialize language store with current locale from Paraglide
	if (typeof window !== 'undefined') {
		// Language is already set via Paraglide middleware
		// Initialize theme on client side
		themeStore.initializeTheme();
	}

	return {};
};
