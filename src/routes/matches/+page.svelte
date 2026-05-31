<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { api } from '$lib/api/client';
	import * as m from '$lib/paraglide/messages';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { Clock, Check, ChevronLeft, ChevronRight } from 'lucide-svelte';

	import type { MatchResponse } from '$lib/api/matches.api';
	import type { MatchScoreResponse } from '$lib/api/scores.api';
	import type { TeamResponse } from '$lib/api/teams.api';
	import type { FieldResponse } from '$lib/api/fields.api';

	let loading = $state(true);
	let error = $state<string | null>(null);

	let matches: MatchResponse[] = $state([]);
	let teams: TeamResponse[] = $state([]);
	let fields: FieldResponse[] = $state([]);

	let teamMap = $state(new Map());
	let fieldMap = $state(new Map());

	let scheduledList: MatchResponse[] = $state([]);
	let finishedList: MatchResponse[] = $state([]);

	let tab: 'scheduled' | 'results' = $state('scheduled');

	const PAGE_SIZE = 10;
	let scheduledPage = $state(1);
	let resultsPage = $state(1);

	let scoresMap = $state(new Map<string, MatchScoreResponse>());
	let refreshTimer: number | null = null;
	const REFRESH_MS = 60_000;
	let lastRefresh = 0;

	async function loadAll() {
		try {
			loading = true;
			error = null;

			const [matchesRes, teamsRes, fieldsRes] = await Promise.all([
				api.matches.getAll(),
				api.teams.getAll(),
				api.fields.getAll()
			]);

			if (!matchesRes.data?.matches) throw new Error('Invalid matches response');
			if (!teamsRes.data?.teams) throw new Error('Invalid teams response');
			if (!fieldsRes.data?.fields) throw new Error('Invalid fields response');

			matches = matchesRes.data.matches;
			teams = teamsRes.data.teams;
			fields = fieldsRes.data.fields;

			teamMap = new Map(teams.map((t) => [t.id, t]));
			fieldMap = new Map(fields.map((f) => [f.id, f]));		scoresMap = new Map();
			await loadScoresForCurrentPage();
			lastRefresh = Date.now();
		} catch (err) {
			console.error('Error loading matches page:', err);
			error = err instanceof Error ? err.message : 'Failed to load data';
		} finally {
			loading = false;
		}
	}

	function formatMatchId(match: MatchResponse) {
		return `${match.phase.toUpperCase()}-${String(match.matchNumber).padStart(2, '0')}`;
	}

	function getTeamNames(ids: string[]) {
		return ids.map((id) => teamMap.get(id)?.name || 'N/A');
	}

	function scheduledMatchesSorted() {
		return matches
			.filter((m) => m.status === 'scheduled' || m.status === 'queued')
			.sort((a, b) => {
				const ta = a.scheduledTime ? new Date(a.scheduledTime).getTime() : Infinity;
				const tb = b.scheduledTime ? new Date(b.scheduledTime).getTime() : Infinity;
				return ta - tb;
			});
	}

	function finishedMatchesSorted() {
		return matches
			.filter((m) => m.status === 'finished')
			.sort((a, b) => {
				const ta = a.endTime ? new Date(a.endTime).getTime() : 0;
				const tb = b.endTime ? new Date(b.endTime).getTime() : 0;
				return tb - ta;
			});
	}

	$effect(() => {
		scheduledList = scheduledMatchesSorted();
		finishedList = finishedMatchesSorted();
	});

	function pageItems(list: MatchResponse[], page: number) {
		const start = (page - 1) * PAGE_SIZE;
		return list.slice(start, start + PAGE_SIZE);
	}

	async function loadScoresForCurrentPage() {
		const finishedMatches = finishedMatchesSorted();
		const pageList = pageItems(finishedMatches, resultsPage);
		const idsToFetch = pageList
			.filter((match) => !scoresMap.has(match.id))
			.map((match) => match.id);

		if (!idsToFetch.length) return;

		const map = new Map(scoresMap);
		await Promise.all(
			idsToFetch.map(async (matchId) => {
				try {
					const res = await api.scores.getByMatchId(matchId);
					if (res.data?.score) map.set(matchId, res.data.score);
				} catch (e) {
					console.warn('No score for', matchId);
				}
			})
		);
		scoresMap = map;
	}

	function getScore(matchId: string) {
		return scoresMap.get(matchId) ?? { red: { total: 0 }, blue: { total: 0 } };
	}

	function getScoreDisplay(matchId: string) {
		const s = scoresMap.get(matchId);
		if (!s) return '—';
		return `${s.red.total} — ${s.blue.total}`;
	}

	function getMatchWinner(matchId: string) {
		const s = scoresMap.get(matchId);
		if (!s) return 'draw';
		if (s.red.total > s.blue.total) return 'red';
		if (s.blue.total > s.red.total) return 'blue';
		return 'draw';
	}

	function totalPages(listLength: number) {
		return Math.max(1, Math.ceil(listLength / PAGE_SIZE));
	}

	$effect(() => {
		if (tab === 'results') {
			loadScoresForCurrentPage();
		}
	});

	function refreshData() {
		if (Date.now() - lastRefresh < REFRESH_MS) return;
		loadAll();
	}

	onMount(() => {
		loadAll();
		refreshTimer = window.setInterval(refreshData, REFRESH_MS);
	});

	onDestroy(() => {
		if (refreshTimer) {
			clearInterval(refreshTimer);
		}
	});
</script>

<Navbar />

<section class="relative overflow-hidden bg-slate-950/5 py-20 dark:bg-slate-950">
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<div class="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"></div>
		<div class="absolute right-0 top-20 h-60 w-60 rounded-full bg-purple-400/10 blur-3xl"></div>
		<div class="absolute left-0 bottom-0 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl"></div>
	</div>

	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-10 rounded-[32px] border border-white/10 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-10">
			<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">
						{m.matches_label()}
					</p>
					<h1 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
						{m.matches_title()}
					</h1>
					
				</div>
				
			</div>
		</div>

		<div class="glass-card relative overflow-hidden rounded-[32px] border border-white/10 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85 dark:shadow-black/20 sm:p-8">
			<div class="mb-6 flex flex-wrap items-center gap-3">
				<button
					type="button"
					class={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 ${tab === 'scheduled' ? 'bg-slate-900 text-white shadow-cyan-500/10' : 'bg-white text-slate-700 shadow-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
					onclick={() => (tab = 'scheduled')}
				>
					<Clock size={16} class="text-cyan-400" />
					<span>Upcoming</span>
				</button>
				<button
					type="button"
					class={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 ${tab === 'results' ? 'bg-slate-900 text-white shadow-cyan-500/10' : 'bg-white text-slate-700 shadow-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
					onclick={() => (tab = 'results')}
				>
					<Check size={16} class="text-emerald-400" />
					<span>Results</span>
				</button>
			</div>
			

			{#if loading}
				<div class="py-8 text-center">Loading…</div>
			{:else if error}
				<div class="py-8 text-center text-red-500">{error}</div>
			{:else}
				{#if tab === 'scheduled'}
					{#if scheduledList.length === 0}
						<div class="py-8 text-center">No upcoming matches</div>
					{:else}
						<div class="grid gap-4 md:grid-cols-2">
							{#each pageItems(scheduledList, scheduledPage) as match}
								<article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/80">
									<div class="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
										<span class="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{formatMatchId(match)}</span>
										<div class="flex flex-wrap items-center gap-2">
											<span>{fieldMap.get(match.fieldId)?.name || 'TBD'}</span>
											<span>·</span>
											<span>{match.scheduledTime ? new Date(match.scheduledTime).toLocaleString() : 'TBD'}</span>
										</div>
									</div>
									<div class="grid gap-3 sm:grid-cols-2">
										<div class="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/70">
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Red alliance</p>
											<div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
												{#each getTeamNames(match.redTeamIds) as team}
													<p>{team}</p>
												{/each}
											</div>
										</div>
										<div class="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/70">
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Blue alliance</p>
											<div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
												{#each getTeamNames(match.blueTeamIds) as team}
													<p>{team}</p>
												{/each}
											</div>
										</div>
									</div>
								</article>
							{/each}
						</div>

						<div class="mt-4 flex items-center justify-end gap-2">
							<button
								onclick={() => (scheduledPage = Math.max(1, scheduledPage - 1))}
								class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200"
							>
								<ChevronLeft size={16} />
							</button>
							<span class="text-sm text-slate-600 dark:text-slate-400">Page {scheduledPage} / {totalPages(scheduledList.length)}</span>
							<button
								onclick={() => (scheduledPage = Math.min(totalPages(scheduledList.length), scheduledPage + 1))}
								class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200"
							>
								<ChevronRight size={16} />
							</button>
						</div>
					{/if}
				{:else}
					{#if finishedList.length === 0}
						<div class="py-8 text-center">No results yet</div>
					{:else}
						<div class="grid gap-4 md:grid-cols-2">
							{#each pageItems(finishedList, resultsPage) as match}
								<article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/80">
									<div class="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
										<span class="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{formatMatchId(match)}</span>
										<div class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">
											{fieldMap.get(match.fieldId)?.name || 'N/A'}
										</div>
									</div>
										<p class="mb-4 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
											{match.endTime ? new Date(match.endTime).toLocaleString() : 'N/A'}
										</p>
								<div class="grid gap-3 sm:grid-cols-[1fr_auto_1fr] items-center">
									<div class={`rounded-3xl p-4 ${getMatchWinner(match.id) === 'red' ? 'border-2 border-red-500 bg-red-50 dark:bg-red-500/10' : 'bg-slate-50 dark:bg-slate-950/70'}`}>
										<p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Red alliance</p>
										<div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
											{#each getTeamNames(match.redTeamIds) as team}
												<p>{team}</p>
											{/each}
										</div>
									</div>
									<div class="flex flex-col items-center justify-center gap-2 rounded-3xl bg-slate-900 px-4 py-6 text-white dark:bg-white/10 dark:text-white">
										<p class="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-300">Final</p>
												<p class="text-xl font-black">{getScoreDisplay(match.id)}</p>
										<p class={`text-xs font-semibold ${getMatchWinner(match.id) === 'red' ? 'text-red-400' : getMatchWinner(match.id) === 'blue' ? 'text-sky-400' : 'text-slate-400'}`}>
											{getMatchWinner(match.id) === 'red' ? 'Red ✓' : getMatchWinner(match.id) === 'blue' ? 'Blue ✓' : 'Draw'}
										</p>
									</div>
									<div class={`rounded-3xl p-4 ${getMatchWinner(match.id) === 'blue' ? 'border-2 border-sky-500 bg-blue-50 dark:bg-blue-500/10' : 'bg-slate-50 dark:bg-slate-950/70'}`}>
										<p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Blue alliance</p>
										<div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
											{#each getTeamNames(match.blueTeamIds) as team}
												<p>{team}</p>
											{/each}
										</div>
									</div>
								</div>
							</article>
							{/each}
						</div>

						<div class="mt-4 flex items-center justify-end gap-2">
							<button
								onclick={async () => { resultsPage = Math.max(1, resultsPage - 1); await loadScoresForCurrentPage(); }}
								class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200"
							>
								<ChevronLeft size={16} />
							</button>
							<span class="text-sm text-slate-600 dark:text-slate-400">Page {resultsPage} / {totalPages(finishedList.length)}</span>
							<button
								onclick={async () => { resultsPage = Math.min(totalPages(finishedList.length), resultsPage + 1); await loadScoresForCurrentPage(); }}
								class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200"
							>
								<ChevronRight size={16} />
							</button>
						</div>
					{/if}
				{/if}
			{/if}
		</div>
	</div>
</section>


<Footer />

