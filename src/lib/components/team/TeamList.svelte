<script lang="ts">
	import {
		Search,
		Plus,
		Users,
		Trophy,
		ChevronUp,
		ChevronDown as ChevronDownIcon
	} from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import { teamStore } from '$lib/stores/teams';
	import { uiStore } from '$lib/stores/ui';
	import TeamStatusBadge from './TeamStatusBadge.svelte';
	import { fade, fly } from 'svelte/transition';

	const { filteredTeams, searchQuery } = teamStore;
	const { switchTab } = uiStore;

	type SortField = 'rank' | 'name' | 'memberCount' | 'score';
	type SortDir = 'asc' | 'desc';

	let sortField: SortField = $state('rank');
	let sortDir: SortDir = $state('asc');

	let sorted = $derived(
		[...$filteredTeams].sort((a, b) => {
			const mul = sortDir === 'asc' ? 1 : -1;
			if (sortField === 'name') return mul * a.name.localeCompare(b.name);
			return mul * ((a[sortField] as number) - (b[sortField] as number));
		})
	);

	function toggleSort(field: SortField) {
		if (sortField === field) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDir = field === 'rank' ? 'asc' : 'desc';
		}
	}

	function getRankStyle(rank: number) {
		if (rank === 1) return 'text-yellow-400 font-bold';
		if (rank === 2) return 'text-slate-300 font-bold';
		if (rank === 3) return 'text-amber-600 font-bold';
		return 'text-slate-500';
	}
</script>

<div class="flex flex-col gap-4" in:fade={{ duration: 300 }}>
	<!-- Toolbar -->
	<div class="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
		<!-- Search -->
		<div class="relative max-w-sm flex-1">
			<Search
				size={15}
				class="absolute top-1/2 left-3 -translate-y-1/2 opacity-50"
				style="color: var(--accent-cyan);"
			/>
			<input
				class="input-field !pl-9"
				type="text"
				placeholder={$t('teams.search_placeholder')}
				bind:value={$searchQuery}
				aria-label={$t('teams.search_placeholder')}
			/>
		</div>

		<!-- Add team button -->
		<button
			onclick={() => switchTab('register')}
			class="btn-primary justify-center gap-2"
			aria-label={$t('teams.add_team')}
		>
			<Plus size={16} />
			{$t('teams.add_team')}
		</button>
	</div>

	<!-- Table wrapper -->
	<div class="glass-card overflow-hidden">
		<div class="overflow-x-auto">
			{#if sorted.length === 0}
				<div class="py-20 text-center" in:fade={{ duration: 200 }}>
					<Users size={40} class="mx-auto mb-3 opacity-30" />
					<p class="text-sm" style="color: var(--text-secondary);">{$t('teams.empty')}</p>
				</div>
			{:else}
				<table class="data-table w-full" aria-label={$t('teams.title')}>
					<thead>
						<tr>
							<th scope="col">
								<button
									class="flex items-center gap-1 transition-colors duration-150 hover:text-white"
									onclick={() => toggleSort('rank')}
									aria-label="Sort by rank"
								>
									{$t('teams.columns.rank')}
									{#if sortField === 'rank'}
										{#if sortDir === 'asc'}<ChevronUp size={12} />{:else}<ChevronDownIcon
												size={12}
											/>{/if}
									{/if}
								</button>
							</th>
							<th scope="col">
								<button
									class="flex items-center gap-1 transition-colors duration-150 hover:text-white"
									onclick={() => toggleSort('name')}
								>
									{$t('teams.columns.name')}
									{#if sortField === 'name'}
										{#if sortDir === 'asc'}<ChevronUp size={12} />{:else}<ChevronDownIcon
												size={12}
											/>{/if}
									{/if}
								</button>
							</th>
							<th scope="col" class="hidden sm:table-cell">
								<button
									class="flex items-center gap-1 transition-colors duration-150 hover:text-white"
									onclick={() => toggleSort('memberCount')}
								>
									{$t('teams.columns.members')}
									{#if sortField === 'memberCount'}
										{#if sortDir === 'asc'}<ChevronUp size={12} />{:else}<ChevronDownIcon
												size={12}
											/>{/if}
									{/if}
								</button>
							</th>
							<th scope="col">
								<button
									class="flex items-center gap-1 transition-colors duration-150 hover:text-white"
									onclick={() => toggleSort('score')}
								>
									{$t('teams.columns.score')}
									{#if sortField === 'score'}
										{#if sortDir === 'asc'}<ChevronUp size={12} />{:else}<ChevronDownIcon
												size={12}
											/>{/if}
									{/if}
								</button>
							</th>
							<th scope="col" class="hidden md:table-cell">{$t('teams.columns.status')}</th>
						</tr>
					</thead>
					<tbody>
						{#each sorted as team, i (team.id)}
							<tr in:fly={{ y: 10, duration: 200, delay: i * 30 }}>
								<!-- Rank -->
								<td class="w-16">
									<div class="flex items-center gap-1.5">
										{#if team.rank <= 3}
											<Trophy size={13} class={getRankStyle(team.rank)} />
										{/if}
										<span class={`font-mono text-sm ${getRankStyle(team.rank)}`}>
											{team.rank}
										</span>
									</div>
								</td>

								<!-- Team name + captain -->
								<td>
									<div class="flex flex-col">
										<span class="text-sm font-semibold" style="color: var(--text-primary);">
											{team.name}
										</span>
										<span class="text-xs" style="color: var(--text-secondary);">
											{team.captainName}
										</span>
									</div>
								</td>

								<!-- Members (hidden on mobile) -->
								<td class="hidden sm:table-cell">
									<div class="flex items-center gap-1.5">
										<Users size={13} style="color: var(--accent-cyan); opacity: 0.7;" />
										<span class="font-mono text-sm">{team.memberCount}</span>
									</div>
								</td>

								<!-- Score -->
								<td>
									<span
										class="font-mono text-sm font-bold"
										style="color: {team.score > 0
											? 'var(--accent-cyan)'
											: 'var(--text-secondary)'};"
									>
										{team.score > 0 ? team.score.toLocaleString() : '—'}
									</span>
								</td>

								<!-- Status (hidden on small) -->
								<td class="hidden md:table-cell">
									<TeamStatusBadge status={team.status} />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		<!-- Footer count -->
		{#if sorted.length > 0}
			<div
				class="flex items-center justify-between border-t px-4 py-3"
				style="border-color: var(--border-color);"
			>
				<span class="font-mono text-xs" style="color: var(--text-secondary);">
					{sorted.length}
					{$t('teams.title').toLowerCase()}
				</span>
				<div class="flex items-center gap-1.5">
					<div class="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"></div>
					<span class="font-mono text-xs" style="color: var(--text-secondary);">LIVE</span>
				</div>
			</div>
		{/if}
	</div>
</div>
