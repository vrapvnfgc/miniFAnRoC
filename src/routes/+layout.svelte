<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref, getLocale } from '$lib/paraglide/runtime';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { languageStore } from '$lib/stores/language.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	// Init theme on client mount
	$effect.pre(() => {
		if (typeof window !== 'undefined' && !themeStore.mounted) {
			themeStore.initializeTheme();
		}
	});

	// Sync paraglide's current locale into our store on every navigation
	$effect(() => {
		const current = getLocale() as 'en' | 'vi';
		languageStore.initializeLocale(current);
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{@render children()}

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as any)}>{locale}</a>
	{/each}
</div>
