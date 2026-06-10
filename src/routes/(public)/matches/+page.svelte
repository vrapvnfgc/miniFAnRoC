<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api/client';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
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

	let selectedMatchId: string | null = $state(null);

	let scoresMap = $state(new Map<string, MatchScoreResponse>());
	let refreshTimer: number | null = null;
	const REFRESH_MS = 60_000;
	let lastRefresh = 0;
	let searchQuery = $state('');
	const locale = $derived(getLocale() as 'en' | 'vi');
	const text = $derived.by(() =>
		locale === 'vi'
			? {
					upcoming: 'Sắp diễn ra',
					results: 'Kết quả',
					searchPlaceholder: 'Tìm theo tên đội...',
					loading: 'Đang tải...',
					noUpcoming: 'Chưa có trận sắp diễn ra',
					noMatchesFound: 'Không tìm thấy trận cho',
					noResults: 'Chưa có kết quả',
					noResultsFound: 'Không tìm thấy kết quả cho',
					redAlliance: 'Liên minh đỏ',
					blueAlliance: 'Liên minh xanh',
					final: 'Hoàn tất',
					page: 'Trang',
					viewDetails: 'Xem chi tiết',
					matchDetails: 'Chi tiết trận đấu',
					close: 'Đóng',
					teleIndependent: 'Tele độc lập',
					shared: 'Điểm chung',
					penalties: 'Phạt',
					endgame: 'Endgame',
					endgameMultiplier: 'Hệ số endgame',
					total: 'Tổng'
				}
			: {
					upcoming: 'Upcoming',
					results: 'Results',
					searchPlaceholder: 'Search by team name...',
					loading: 'Loading...',
					noUpcoming: 'No upcoming matches',
					noMatchesFound: 'No matches found for',
					noResults: 'No results yet',
					noResultsFound: 'No results found for',
					redAlliance: 'Red alliance',
					blueAlliance: 'Blue alliance',
					final: 'Final',
					page: 'Page',
					viewDetails: 'View details',
					matchDetails: 'Match details',
					close: 'Close',
					teleIndependent: 'Tele Independent',
					shared: 'Shared',
					penalties: 'Penalties',
					endgame: 'Endgame',
					endgameMultiplier: 'Endgame Mult',
					total: 'Total'
				}
	);

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

	function getTeamById(id: string) {
		return teamMap.get(id) || null;
	}

	async function navigateToTeam(teamId: string) {
		const team = getTeamById(teamId);
		if (team) {
			await goto(`/teams/${team.teamNumber}`);
		}
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

	function getSelectedMatchDetails() {
		if (!selectedMatchId) return null;
		const match = matches.find((m) => m.id === selectedMatchId);
		const score = scoresMap.get(selectedMatchId);
		if (!match || !score) return null;
		return { match, score };
	}

	function getFilteredMatches(matchList: MatchResponse[]) {
		if (!searchQuery.trim()) return matchList;

		const query = searchQuery.toLowerCase();
		const matchingTeamIds = new Set<string>();

		// Find all teams that match the search query
		teamMap.forEach((team) => {
			if (team.name.toLowerCase().includes(query)) {
				matchingTeamIds.add(team.id);
			}
		});

		if (matchingTeamIds.size === 0) return [];

		// Filter matches to only include those with matching teams
		return matchList.filter((match) => {
			const redHasTeam = match.redTeamIds.some((id) => matchingTeamIds.has(id));
			const blueHasTeam = match.blueTeamIds.some((id) => matchingTeamIds.has(id));
			return redHasTeam || blueHasTeam;
		});
	}

	function totalPages(listLength: number) {
		return Math.max(1, Math.ceil(listLength / PAGE_SIZE));
	}

	$effect(() => {
		if (tab === 'results') {
			loadScoresForCurrentPage();
		}
	});

	$effect(() => {
		// Reset pagination when search query changes
		void searchQuery; // Access to create dependency
		scheduledPage = 1;
		resultsPage = 1;
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
					<span>{text.upcoming}</span>
				</button>
				<button
					type="button"
					class={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 ${tab === 'results' ? 'bg-slate-900 text-white shadow-cyan-500/10' : 'bg-white text-slate-700 shadow-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
					onclick={() => (tab = 'results')}
				>
					<Check size={16} class="text-emerald-400" />
					<span>{text.results}</span>
				</button>
				<div class="flex-1 sm:ml-auto">
					<input
						type="text"
						placeholder={text.searchPlaceholder}
						bind:value={searchQuery}
						class="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 transition focus:border-cyan-400 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
					/>
				</div>
			</div>
			

			{#if loading}
				<div class="py-8 text-center">{text.loading}</div>
			{:else if error}
				<div class="py-8 text-center text-red-500">{error}</div>
			{:else}
				{#if tab === 'scheduled'}
					{#if scheduledList.length === 0}
						<div class="py-8 text-center">{text.noUpcoming}</div>
					{:else if getFilteredMatches(scheduledList).length === 0}
						<div class="py-8 text-center text-slate-500 dark:text-slate-400">
							{text.noMatchesFound} "{searchQuery}"
						</div>
					{:else}
						<div class="grid gap-4 md:grid-cols-2">
							{#each pageItems(getFilteredMatches(scheduledList), scheduledPage) as match}
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
												<div class="rounded-3xl bg-slate-50 p-4 transition hover:shadow-lg hover:shadow-red-500/50 dark:bg-slate-950/70">
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">{text.redAlliance}</p>
											<div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
												{#each match.redTeamIds as teamId}
													<button
														type="button"
														onclick={() => navigateToTeam(teamId)}
														class="block text-left transition hover:text-cyan-600 dark:hover:text-cyan-400"
													>
														{teamMap.get(teamId)?.name || 'N/A'}
													</button>
												{/each}
											</div>
										</div>
												<div class="rounded-3xl bg-slate-50 p-4 transition hover:shadow-lg hover:shadow-sky-500/50 dark:bg-slate-950/70">
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">{text.blueAlliance}</p>
											<div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
												{#each match.blueTeamIds as teamId}
													<button
														type="button"
														onclick={() => navigateToTeam(teamId)}
														class="block text-left transition hover:text-cyan-600 dark:hover:text-cyan-400"
													>
														{teamMap.get(teamId)?.name || 'N/A'}
													</button>
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
							<span class="text-sm text-slate-600 dark:text-slate-400">{text.page} {scheduledPage} / {totalPages(getFilteredMatches(scheduledList).length)}</span>
							<button
								onclick={() => (scheduledPage = Math.min(totalPages(getFilteredMatches(scheduledList).length), scheduledPage + 1))}
								class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200"
							>
								<ChevronRight size={16} />
							</button>
						</div>
					{/if}
				{:else}
					{#if finishedList.length === 0}
						<div class="py-8 text-center">{text.noResults}</div>
				{:else if getFilteredMatches(finishedList).length === 0}
					<div class="py-8 text-center text-slate-500 dark:text-slate-400">
						{text.noResultsFound} "{searchQuery}"
					</div>
				{:else}
					<div class="grid gap-4 md:grid-cols-2">
						{#each pageItems(getFilteredMatches(finishedList), resultsPage) as match}
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
											<div class="rounded-3xl bg-slate-50 p-4 transition hover:shadow-lg hover:shadow-red-500/50 dark:bg-slate-950/70">
										<p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">{text.redAlliance}</p>
										<div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
											{#each match.redTeamIds as teamId}
												<button
													type="button"
													onclick={() => navigateToTeam(teamId)}
													class="block text-left transition hover:text-cyan-600 dark:hover:text-cyan-400"
												>
													{teamMap.get(teamId)?.name || 'N/A'}
												</button>
											{/each}
										</div>
									</div>
									<div class="flex flex-col items-center justify-center gap-2 rounded-3xl bg-slate-900 px-4 py-6 text-white dark:bg-white/10 dark:text-white">
										<p class="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-300">{text.final}</p>
												<p class="text-xl font-black">{getScoreDisplay(match.id)}</p>
									</div>
											<div class="rounded-3xl bg-slate-50 p-4 transition hover:shadow-lg hover:shadow-sky-500/50 dark:bg-slate-950/70">
										<p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">{text.blueAlliance}</p>
										<div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
											{#each match.blueTeamIds as teamId}
												<button
													type="button"
													onclick={() => navigateToTeam(teamId)}
													class="block text-left transition hover:text-cyan-600 dark:hover:text-cyan-400"
												>
													{teamMap.get(teamId)?.name || 'N/A'}
												</button>
											{/each}
										</div>
									</div>
								</div>
								<div class="mt-4">
									<button
										onclick={() => (selectedMatchId = match.id)}
										class="w-full rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600"
									>
										{text.viewDetails}
									</button>
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
					<span class="text-sm text-slate-600 dark:text-slate-400">{text.page} {resultsPage} / {totalPages(getFilteredMatches(finishedList).length)}</span>
					<button
						onclick={async () => { resultsPage = Math.min(totalPages(getFilteredMatches(finishedList).length), resultsPage + 1); await loadScoresForCurrentPage(); }}
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

	{#if selectedMatchId && getSelectedMatchDetails()}
		{@const details = getSelectedMatchDetails()}
		{#if details}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
			<div class="glass-card max-h-screen w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85 dark:shadow-black/20 sm:p-8">
				<div class="mb-6 flex items-center justify-between">
					<div>
						<p class="text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">{text.matchDetails}</p>
						<h2 class="mt-2 text-2xl font-black text-slate-900 dark:text-white">{formatMatchId(details.match)}</h2>
					</div>
					<button
						onclick={() => (selectedMatchId = null)}
						title={text.close}
						class="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="space-y-4">
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
						<div class="grid gap-4 sm:grid-cols-2">
							<div>
								<h3 class="mb-3 text-sm font-semibold text-red-600 dark:text-red-400">{text.redAlliance}</h3>
								<div class="space-y-2 text-sm">
									<div class="flex justify-between">
										<span class="text-slate-600 dark:text-slate-400">{text.teleIndependent}:</span>
										<span class="font-semibold text-slate-900 dark:text-white">{details.score.red.teleIndependent ?? 'N/A'}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-slate-600 dark:text-slate-400">{text.shared}:</span>
										<span class="font-semibold text-slate-900 dark:text-white">{details.score.red.sharedScore ?? 'N/A'}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-slate-600 dark:text-slate-400">{text.penalties}:</span>
										<span class="font-semibold text-slate-900 dark:text-white">-{details.score.red.penalties ?? 'N/A'}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-slate-600 dark:text-slate-400">{text.endgame}:</span>
										<span class="font-semibold text-slate-900 dark:text-white">{details.score.red.endgame ?? 'N/A'}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-slate-600 dark:text-slate-400">{text.endgameMultiplier}:</span>
										<span class="font-semibold text-slate-900 dark:text-white">×{details.score.red.endgameMultiplier ?? 'N/A'}</span>
									</div>
									<div class="border-t border-slate-200 pt-2 dark:border-white/10">
										<div class="flex justify-between">
											<span class="font-semibold text-red-600 dark:text-red-400">{text.total}:</span>
											<span class="text-lg font-black text-red-600 dark:text-red-400">{details.score.red.total ?? 'N/A'}</span>
										</div>
									</div>
								</div>
							</div>

							<div>
								<h3 class="mb-3 text-sm font-semibold text-sky-600 dark:text-sky-400">{text.blueAlliance}</h3>
								<div class="space-y-2 text-sm">
									<div class="flex justify-between">
										<span class="text-slate-600 dark:text-slate-400">{text.teleIndependent}:</span>
										<span class="font-semibold text-slate-900 dark:text-white">{details.score.blue.teleIndependent ?? 'N/A'}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-slate-600 dark:text-slate-400">{text.shared}:</span>
										<span class="font-semibold text-slate-900 dark:text-white">{details.score.blue.sharedScore ?? 'N/A'}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-slate-600 dark:text-slate-400">{text.penalties}:</span>
										<span class="font-semibold text-slate-900 dark:text-white">-{details.score.blue.penalties ?? 'N/A'}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-slate-600 dark:text-slate-400">{text.endgame}:</span>
										<span class="font-semibold text-slate-900 dark:text-white">{details.score.blue.endgame ?? 'N/A'}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-slate-600 dark:text-slate-400">{text.endgameMultiplier}:</span>
										<span class="font-semibold text-slate-900 dark:text-white">×{details.score.blue.endgameMultiplier ?? 'N/A'}</span>
									</div>
									<div class="border-t border-slate-200 pt-2 dark:border-white/10">
										<div class="flex justify-between">
											<span class="font-semibold text-sky-600 dark:text-sky-400">{text.total}:</span>
											<span class="text-lg font-black text-sky-600 dark:text-sky-400">{details.score.blue.total ?? 'N/A'}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- <div class="mt-6">
					<button
						onclick={() => (selectedMatchId = null)}
						class="w-full rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
					>
						Close
					</button>
				</div> -->
			</div>
		</div>
		{/if}
	{/if}
</section>


<Footer />

