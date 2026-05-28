<script lang="ts">
	import { List, UserPlus } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import { uiStore } from '$lib/stores/ui';
	import TeamList from '../team/TeamList.svelte';
	import TeamRegister from '../team/TeamRegister.svelte';

	const { activeTab, switchTab } = uiStore;

	const tabs = [
		{ key: 'list' as const, labelKey: 'teams.title', icon: List },
		{ key: 'register' as const, labelKey: 'register.title', icon: UserPlus }
	];
</script>

<section id="teams" class="relative py-20 px-4 sm:px-6 lg:px-8" aria-label={$t('teams.title')}>
	<!-- Section background glow -->
	<div class="absolute inset-0 pointer-events-none overflow-hidden">
		<div class="absolute w-full h-px top-0" style="background: linear-gradient(90deg, transparent, rgba(0,180,230,0.3), transparent);" />
	</div>

	<div class="max-w-6xl mx-auto">
		<!-- Section heading -->
		<div class="text-center mb-12">
			<span class="font-mono text-xs uppercase tracking-widest mb-3 block" style="color: var(--accent-cyan);">
				// Competition
			</span>
			<h2 class="section-title text-3xl sm:text-4xl lg:text-5xl mb-4">
				{$t('teams.title')}
			</h2>
			<p class="max-w-xl mx-auto text-sm sm:text-base" style="color: var(--text-secondary);">
				{$t('teams.subtitle')}
			</p>
		</div>

		<!-- Tab selector -->
		<div class="flex items-center gap-2 p-1 rounded-2xl mb-8 w-fit mx-auto sm:mx-0"
			style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color);"
			role="tablist"
			aria-label="Team section tabs"
		>
			{#each tabs as tab}
				{@const isActive = $activeTab === tab.key}
				<button
					role="tab"
					aria-selected={isActive}
					aria-controls="tab-panel-{tab.key}"
					class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-250"
					style={isActive
						? 'background: linear-gradient(135deg, rgba(0,180,230,0.25), rgba(139,71,255,0.25)); color: var(--text-primary); border: 1px solid rgba(0,180,230,0.4);'
						: 'color: var(--text-secondary); border: 1px solid transparent;'}
					on:click={() => switchTab(tab.key)}
				>
					<svelte:component this={tab.icon} size={15} />
					<span class="hidden sm:inline">{$t(tab.labelKey)}</span>
				</button>
			{/each}
		</div>

		<!-- Tab panels -->
		<div id="tab-panel-list" role="tabpanel" aria-labelledby="tab-list" hidden={$activeTab !== 'list'}>
			{#if $activeTab === 'list'}
				<TeamList />
			{/if}
		</div>
		<div id="tab-panel-register" role="tabpanel" aria-labelledby="tab-register" hidden={$activeTab !== 'register'}>
			{#if $activeTab === 'register'}
				<TeamRegister />
			{/if}
		</div>
	</div>
</section>
