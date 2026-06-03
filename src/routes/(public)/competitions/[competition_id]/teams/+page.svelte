<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { teamStore, type Team } from '$lib/stores/teams';
	import { Search, Plus, Users, ChevronUp, ChevronDown, Shield, Activity } from 'lucide-svelte';

	const competitionId = $derived(page.params.competition_id);

	// Reactive state from store
	let teams = $state<Team[]>([]);
	let filtered = $state<Team[]>([]);
	let search = $state('');
	let sortKey = $state<keyof Team>('rank');
	let sortDir = $state<'asc' | 'desc'>('asc');
	let stats = $state({ total: 0, participants: 0, active: 0 });

	// Subscribe to store
	const unsubTeams = teamStore.teams.subscribe((v) => { teams = v; });
	const unsubFiltered = teamStore.filteredTeams.subscribe((v) => { filtered = v; });
	const unsubStats = teamStore.stats.subscribe((v) => { stats = v; });

	$effect(() => {
		teamStore.searchQuery.set(search);
	});

	// Client-side sort
	const sorted = $derived(
		[...filtered].sort((a, b) => {
			const av = a[sortKey] as string | number;
			const bv = b[sortKey] as string | number;
			if (typeof av === 'number' && typeof bv === 'number') {
				return sortDir === 'asc' ? av - bv : bv - av;
			}
			return sortDir === 'asc'
				? String(av).localeCompare(String(bv))
				: String(bv).localeCompare(String(av));
		})
	);

	function toggleSort(key: keyof Team) {
		if (sortKey === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDir = 'asc';
		}
	}

	function goRegister() {
		goto(`/competitions/${competitionId}/register`);
	}

	function statusColor(status: string) {
		if (status === 'active') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
		if (status === 'pending') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
		return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
	}

	function statusLabel(status: string) {
		if (status === 'active') return 'Active';
		if (status === 'pending') return 'Pending';
		return 'Eliminated';
	}

	function rankBadge(rank: number) {
		if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold';
		if (rank === 2) return 'bg-gradient-to-r from-slate-300 to-slate-400 text-black font-bold';
		if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-orange-700 text-white font-bold';
		return 'bg-white/5 text-slate-400 font-medium';
	}

	function scoreBar(score: number, max = 3000) {
		return Math.round((score / max) * 100);
	}
</script>

<svelte:head>
	<title>Team List — miniFAnRoC</title>
</svelte:head>

<!-- Stat Cards -->
<div class="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
	<div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
		<p class="text-xs font-semibold uppercase tracking-widest text-slate-500">Total Teams</p>
		<p class="mt-1 text-3xl font-bold text-white">{stats.total}</p>
	</div>
	<div class="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 backdrop-blur-sm">
		<p class="text-xs font-semibold uppercase tracking-widest text-cyan-500">Participants</p>
		<p class="mt-1 text-3xl font-bold text-cyan-400">{stats.participants}</p>
	</div>
	<div class="col-span-2 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 backdrop-blur-sm sm:col-span-1">
		<p class="text-xs font-semibold uppercase tracking-widest text-violet-400">Active Teams</p>
		<p class="mt-1 text-3xl font-bold text-violet-400">{stats.active}</p>
	</div>
</div>

<!-- Toolbar -->
<div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
	<h2 class="text-xl font-bold text-white">
		Danh Sách Đội Thi
		<span class="ml-2 text-sm font-normal text-slate-500">({sorted.length} đội)</span>
	</h2>

	<div class="flex items-center gap-3">
		<!-- Search -->
		<div class="relative flex-1 sm:w-64 sm:flex-none">
			<Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
			<input
				type="text"
				placeholder="Tìm đội thi..."
				bind:value={search}
				class="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none backdrop-blur-sm transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
			/>
		</div>

		<!-- Add button -->
		<button
			onclick={goRegister}
			title="Đăng ký đội mới"
			class="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105 hover:shadow-cyan-500/40 active:scale-95"
		>
			<Plus class="h-4 w-4" />
			<span class="hidden sm:inline">Đăng ký đội</span>
		</button>
	</div>
</div>

<!-- Table (desktop) -->
<div class="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm md:block">
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b border-white/10">
				{#each [
					{ key: 'rank', label: 'STT' },
					{ key: 'name', label: 'Tên Đội' },
					{ key: 'memberCount', label: 'Thành Viên' },
					{ key: 'score', label: 'Điểm' },
					{ key: 'status', label: 'Trạng Thái' }
				] as col}
					<th
						onclick={() => toggleSort(col.key as keyof Team)}
						class="cursor-pointer px-5 py-4 text-left font-semibold text-slate-400 hover:text-white transition-colors select-none"
					>
						<span class="flex items-center gap-1">
							{col.label}
							{#if sortKey === col.key}
								{#if sortDir === 'asc'}
									<ChevronUp class="h-3.5 w-3.5 text-cyan-400" />
								{:else}
									<ChevronDown class="h-3.5 w-3.5 text-cyan-400" />
								{/if}
							{/if}
						</span>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each sorted as team, i (team.id)}
				<tr
					class="border-b border-white/5 transition-colors hover:bg-white/5"
					class:bg-cyan-500/5={team.rank <= 3}
				>
					<!-- Rank -->
					<td class="px-5 py-4">
						<span class="inline-flex h-8 w-8 items-center justify-center rounded-full text-xs {rankBadge(team.rank)}">
							{team.rank}
						</span>
					</td>
					<!-- Name -->
					<td class="px-5 py-4">
						<div>
							<p class="font-semibold text-white">{team.name}</p>
							<p class="text-xs text-slate-500">{team.captainName} · {team.captainEmail}</p>
						</div>
					</td>
					<!-- Members -->
					<td class="px-5 py-4">
						<span class="flex items-center gap-1.5 text-slate-300">
							<Users class="h-3.5 w-3.5 text-slate-500" />
							{team.memberCount}
						</span>
					</td>
					<!-- Score with bar -->
					<td class="px-5 py-4">
						<div class="flex flex-col gap-1">
							<span class="font-bold text-cyan-400">{team.score.toLocaleString()}</span>
							<div class="h-1 w-24 overflow-hidden rounded-full bg-white/10">
								<div
									class="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
									style="width: {scoreBar(team.score)}%"
								></div>
							</div>
						</div>
					</td>
					<!-- Status -->
					<td class="px-5 py-4">
						<span class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium {statusColor(team.status)}">
							<Activity class="h-3 w-3" />
							{statusLabel(team.status)}
						</span>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="5" class="px-5 py-16 text-center text-slate-500">
						<div class="flex flex-col items-center gap-3">
							<Shield class="h-10 w-10 opacity-30" />
							<p>Không tìm thấy đội thi nào</p>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Cards (mobile) -->
<div class="flex flex-col gap-3 md:hidden">
	{#each sorted as team (team.id)}
		<div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
			class:border-cyan-500/30={team.rank <= 3}>
			<div class="flex items-start justify-between">
				<div class="flex items-center gap-3">
					<span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs {rankBadge(team.rank)}">
						{team.rank}
					</span>
					<div>
						<p class="font-semibold text-white">{team.name}</p>
						<p class="text-xs text-slate-500">{team.captainName}</p>
					</div>
				</div>
				<span class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium {statusColor(team.status)}">
					{statusLabel(team.status)}
				</span>
			</div>
			<div class="mt-3 flex items-center gap-4 border-t border-white/10 pt-3 text-sm">
				<span class="flex items-center gap-1 text-slate-400">
					<Users class="h-3.5 w-3.5" />
					{team.memberCount} thành viên
				</span>
				<span class="font-bold text-cyan-400">{team.score.toLocaleString()} điểm</span>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-3 py-16 text-slate-500">
			<Shield class="h-10 w-10 opacity-30" />
			<p>Không tìm thấy đội thi nào</p>
		</div>
	{/each}
</div>
