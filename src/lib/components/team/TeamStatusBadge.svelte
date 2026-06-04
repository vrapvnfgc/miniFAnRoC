<script lang="ts">
	import type { TeamStatus } from '$lib/stores/teams';
	import * as m from '$lib/paraglide/messages';

	let { status }: { status: TeamStatus } = $props();
</script>

{#if status === 'active'}
	<span class="tag-active">{(m as any).teams_status_active?.() || 'Active'}</span>
{:else if status === 'pending'}
	<span class="tag-pending">{(m as any).teams_status_pending?.() || 'Pending'}</span>
{:else}
	<span class="tag-eliminated">{(m as any).teams_status_eliminated?.() || 'Eliminated'}</span>
{/if}
