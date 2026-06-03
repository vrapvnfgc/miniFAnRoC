<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	// Redirect to /teams sub-page by default
	onMount(() => {
		const id = page.params.competition_id;
		goto(`/competitions/${id}/teams`, { replaceState: true });
	});
</script>

<div class="flex items-center justify-center py-24">
	<div class="flex flex-col items-center gap-3">
		<div class="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
		<span class="text-sm text-slate-400">Loading...</span>
	</div>
</div>
