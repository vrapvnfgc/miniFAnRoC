<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { uiStore } from '$lib/stores/ui';
	import { i18n } from '$lib/i18n';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	onMount(() => {
		uiStore.initTheme();
		i18n.initLocale();
	});
</script>

<div class="flex flex-col min-h-screen">
	<Navbar />
	<main class="flex-1">
		<slot />
	</main>
	<Footer />
</div>
