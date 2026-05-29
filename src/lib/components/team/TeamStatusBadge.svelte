<script lang="ts">
	import type { TeamStatus } from '$lib/stores/teams';
	import { t } from '$lib/i18n';

	let { status }: { status: TeamStatus } = $props();
</script>

{#if status === 'active'}
	<span class="tag-active">{$t('teams.status.active')}</span>
{:else if status === 'pending'}
	<span class="tag-pending">{$t('teams.status.pending')}</span>
{:else}
	<span class="tag-eliminated">{$t('teams.status.eliminated')}</span>
{/if}
