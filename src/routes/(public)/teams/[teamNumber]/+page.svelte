<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api/client';
	import * as m from '$lib/paraglide/messages';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { Clock, Check, ChevronLeft, ChevronRight, BarChart3, Trophy } from 'lucide-svelte';

	import type { MatchResponse } from '$lib/api/matches.api';
	import type { MatchScoreResponse } from '$lib/api/scores.api';
	import type { TeamResponse } from '$lib/api/teams.api';
	import type { FieldResponse } from '$lib/api/fields.api';
	import type { CompetitionResponse } from '$lib/api/competitions.api';
	import type { RankingItem } from '$lib/api/rankings.api';

	let { data } = $props();

	let loading = $state(true);
	let error = $state<string | null>(null);

	let team: TeamResponse | null = $state(null);
	let matches: MatchResponse[] = $state([]);
	let fields: FieldResponse[] = $state([]);
	let teams: TeamResponse[] = $state([]);

	let teamMap = $state(new Map());
	let fieldMap = $state(new Map());

	let scheduledMatches: MatchResponse[] = $state([]);
	let finishedMatches: MatchResponse[] = $state([]);

	let tab: 'scheduled' | 'results' = $state('scheduled');

	const PAGE_SIZE = 10;
	let scheduledPage = $state(1);
	let resultsPage = $state(1);

	let selectedMatchId: string | null = $state(null);

	let scoresMap = $state(new Map<string, MatchScoreResponse>());
	let refreshTimer: number | null = null;
	const REFRESH_MS = 60_000;
	let lastRefresh = 0;

	// Competition rankings
	type CompRanking = { competition: CompetitionResponse; ranking: RankingItem };
	let competitionRankings = $state<CompRanking[]>([]);
	let rankingsLoading = $state(false);

	// Stats
	let teamStats = $state({
		wins: 0,
		losses: 0,
		winRate: 0,
		avgScore: 0,
		avgTeleIndependent: 0,
		avgEndgame: 0,
		avgPenalty: 0,
		avgSharedScore: 0,
		avgEndgameMultiplier: 0
	});

	async function loadAll() {
		try {
			loading = true;
			error = null;

			// Find team by team number from data
			const teamNumber = data.teamNumber;
			const teamsRes = await api.teams.getAll();
			if (!teamsRes.data?.teams) throw new Error('Invalid teams response');

			const foundTeam = teamsRes.data.teams.find((t) => t.teamNumber === teamNumber);
			if (!foundTeam) throw new Error('Team not found');

			team = foundTeam;
			teams = teamsRes.data.teams;
			teamMap = new Map(teams.map((t) => [t.id, t]));

			// Load matches and fields
			const [matchesRes, fieldsRes] = await Promise.all([
				api.matches.getAll(),
				api.fields.getAll()
			]);

			if (!matchesRes.data?.matches) throw new Error('Invalid matches response');
			if (!fieldsRes.data?.fields) throw new Error('Invalid fields response');

			matches = matchesRes.data.matches;
			fields = fieldsRes.data.fields;
			fieldMap = new Map(fields.map((f) => [f.id, f]));

			filterAndSortMatches();
			scoresMap = new Map();
			await loadScoresForCurrentPage();
			calculateStats();
			await loadCompetitionRankings(foundTeam);
			lastRefresh = Date.now();
		} catch (err) {
			console.error('Error loading team page:', err);
			error = err instanceof Error ? err.message : 'Failed to load data';
		} finally {
			loading = false;
		}
	}

	async function loadCompetitionRankings(foundTeam: TeamResponse) {
		rankingsLoading = true;
		try {
			const compsRes = await api.competitions.getAll();
			const comps = compsRes.data?.competitions || [];
			const results: CompRanking[] = [];
			await Promise.all(
				comps.map(async (comp) => {
					try {
						const res = await api.competitions.getRankings(comp.id, true);
						const ranking = (res.data?.rankings || []).find(
							(r) => r.teamId === foundTeam.id
						);
						if (ranking) results.push({ competition: comp, ranking });
					} catch {
						// skip competitions where rankings fail
					}
				})
			);
			// sort by competition name
			results.sort((a, b) => a.competition.name.localeCompare(b.competition.name));
			competitionRankings = results;
		} catch {
			competitionRankings = [];
		} finally {
			rankingsLoading = false;
		}
	}

	function filterAndSortMatches() {
		if (!team) return;

		const teamId = team.id;
		const teamMatches = matches.filter(
			(m) => m.redTeamIds.includes(teamId) || m.blueTeamIds.includes(teamId)
		);

		scheduledMatches = teamMatches
			.filter((m) => m.status === 'scheduled' || m.status === 'queued')
			.sort((a, b) => {
				const ta = a.scheduledTime ? new Date(a.scheduledTime).getTime() : Infinity;
				const tb = b.scheduledTime ? new Date(b.scheduledTime).getTime() : Infinity;
				return ta - tb;
			});

		finishedMatches = teamMatches
			.filter((m) => m.status === 'finished')
			.sort((a, b) => {
				const ta = a.endTime ? new Date(a.endTime).getTime() : 0;
				const tb = b.endTime ? new Date(b.endTime).getTime() : 0;
				return tb - ta;
			});
	}

	function pageItems(list: MatchResponse[], page: number) {
		const start = (page - 1) * PAGE_SIZE;
		return list.slice(start, start + PAGE_SIZE);
	}

	async function loadScoresForCurrentPage() {
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

	function calculateStats() {
		if (!team) return;

		const teamId = team.id;
		let wins = 0;
		let losses = 0;
		let totalScore = 0;
		let totalTeleIndependent = 0;
		let totalEndgame = 0;
		let totalPenalty = 0;
		let totalSharedScore = 0;
		let totalEndgameMultiplier = 0;
		let finishedCount = 0;

		finishedMatches.forEach((match) => {
			const score = scoresMap.get(match.id);
			if (!score) return;

			finishedCount++;

			const isRedTeam = match.redTeamIds.includes(teamId);
			const teamScore = isRedTeam ? score.red : score.blue;
			const opponentScore = isRedTeam ? score.blue : score.red;

			if (teamScore.total > opponentScore.total) {
				wins++;
			} else if (teamScore.total < opponentScore.total) {
				losses++;
			}

			totalScore += teamScore.total;
			totalTeleIndependent += teamScore.teleIndependent;
			totalEndgame += teamScore.endgame;
			totalPenalty += teamScore.penalties;
			totalSharedScore += teamScore.sharedScore;
			totalEndgameMultiplier += teamScore.endgameMultiplier;
		});

		teamStats = {
			wins,
			losses,
			winRate: finishedCount > 0 ? (wins / finishedCount) * 100 : 0,
			avgScore: finishedCount > 0 ? totalScore / finishedCount : 0,
			avgTeleIndependent: finishedCount > 0 ? totalTeleIndependent / finishedCount : 0,
			avgEndgame: finishedCount > 0 ? totalEndgame / finishedCount : 0,
			avgPenalty: finishedCount > 0 ? totalPenalty / finishedCount : 0,
			avgSharedScore: finishedCount > 0 ? totalSharedScore / finishedCount : 0,
			avgEndgameMultiplier: finishedCount > 0 ? totalEndgameMultiplier / finishedCount : 0
		};
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

	function getSelectedMatchDetails() {
		if (!selectedMatchId) return null;
		const match = matches.find((m) => m.id === selectedMatchId);
		const score = scoresMap.get(selectedMatchId);
		if (!match || !score) return null;
		return { match, score };
	}

	function formatMatchId(match: MatchResponse) {
		return `${match.phase.toUpperCase()}-${String(match.matchNumber).padStart(2, '0')}`;
	}

	function getTeamNames(ids: string[]) {
		return ids.map((id) => teamMap.get(id)?.name || 'N/A');
	}

	async function navigateToTeam(teamId: string) {
		const team = teamMap.get(teamId);
		if (team) {
			await goto(`/teams/${team.teamNumber}`);
		}
	}

	function totalPages(listLength: number) {
		return Math.max(1, Math.ceil(listLength / PAGE_SIZE));
	}

	function refreshData() {
		if (Date.now() - lastRefresh < REFRESH_MS) return;
		loadAll();
	}

	$effect(() => {
		if (data.teamNumber) {
			loadAll();
		}
	});

	$effect(() => {
		if (tab === 'results') {
			loadScoresForCurrentPage();
		}
	});

	onMount(() => {
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
		<!-- Team Header Card -->
		<div class="mb-10 rounded-[32px] border border-white/10 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-10">
			{#if loading}
				<div class="text-center">Loading team information…</div>
			{:else if error}
				<div class="text-center text-red-500">{error}</div>
			{:else if team}
				<div class="grid gap-8 md:grid-cols-2">
					<!-- Team Info -->
					<div>
						<p class="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">
							Team Information
						</p>
						<h1 class="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
							{team.teamNumber}
						</h1>
						<div class="space-y-3 text-slate-700 dark:text-slate-300">
							<div>
								<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Name</p>
								<p class="text-lg">{team.name || 'N/A'}</p>
							</div>
							<div>
								<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">School</p>
								<p class="text-lg">{team.school || 'N/A'}</p>
							</div>
							<div>
								<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Coach</p>
								<p class="text-lg">{team.coach || 'N/A'}</p>
							</div>
							<div>
								<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Robot Name</p>
								<p class="text-lg">{team.robotName || 'N/A'}</p>
							</div>
						</div>
					</div>

					<!-- Stats Summary -->
					<div>
						<p class="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">
							Performance
						</p>
						<div class="grid grid-cols-2 gap-4">
							<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
								<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Wins</p>
								<p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{teamStats.wins}</p>
							</div>
							<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
								<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Losses</p>
								<p class="text-3xl font-bold text-red-600 dark:text-red-400">{teamStats.losses}</p>
							</div>
							<div class="col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
								<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Win Rate</p>
								<p class="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
									{teamStats.winRate.toFixed(1)}%
								</p>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Average Stats Card -->
		{#if team && !loading && !error}
			<div class="mb-10 rounded-[32px] border border-white/10 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-10">
				<p class="mb-6 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">
					Average Stats
				</p>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Score</p>
						<p class="text-2xl font-bold text-slate-900 dark:text-white">
							{teamStats.avgScore.toFixed(1)}
						</p>
					</div>
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Tele Independent</p>
						<p class="text-2xl font-bold text-slate-900 dark:text-white">
							{teamStats.avgTeleIndependent.toFixed(1)}
						</p>
					</div>
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Endgame</p>
						<p class="text-2xl font-bold text-slate-900 dark:text-white">
							{teamStats.avgEndgame.toFixed(1)}
						</p>
					</div>
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Penalty</p>
						<p class="text-2xl font-bold text-slate-900 dark:text-white">
							{teamStats.avgPenalty.toFixed(1)}
						</p>
					</div>
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Shared Score</p>
						<p class="text-2xl font-bold text-slate-900 dark:text-white">
							{teamStats.avgSharedScore.toFixed(1)}
						</p>
					</div>
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Endgame Multiplier</p>
						<p class="text-2xl font-bold text-slate-900 dark:text-white">
							{teamStats.avgEndgameMultiplier.toFixed(2)}x
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Competition Rankings Card -->
		{#if team && !loading && !error}
			<div class="mb-10 rounded-[32px] border border-white/10 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-10">
				<div class="mb-6 flex items-center gap-3">
					<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
						<BarChart3 class="h-4 w-4 text-white" />
					</div>
					<p class="text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">
						Competition Rankings
					</p>
				</div>

				{#if rankingsLoading}
					<div class="py-8 text-center text-slate-500 dark:text-slate-400">Loading rankings…</div>
				{:else if competitionRankings.length === 0}
					<div class="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-white/10 dark:bg-slate-800/40">
						<div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
							<Trophy class="h-6 w-6 text-slate-400" />
						</div>
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">No competition rankings yet.</p>
					</div>
				{:else}
					<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each competitionRankings as { competition, ranking }}
							<a
								href={`/competitions/${competition.id}`}
								class="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-slate-800/50"
							>
								<!-- Rank badge -->
								<div class="flex items-start justify-between gap-2">
									<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl {ranking.rank === 1 ? 'bg-amber-100 dark:bg-amber-500/20' : ranking.rank === 2 ? 'bg-slate-100 dark:bg-slate-600/40' : ranking.rank === 3 ? 'bg-orange-100 dark:bg-orange-500/20' : 'bg-slate-100 dark:bg-slate-700/60'}">
										<span class="text-xl font-black {ranking.rank === 1 ? 'text-amber-500' : ranking.rank === 2 ? 'text-slate-400' : ranking.rank === 3 ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}">
											#{ranking.rank}
										</span>
									</div>
									<span class="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide
										{competition.status === 'active'
											? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
											: competition.status === 'upcoming'
											? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300'
											: 'border-slate-200 bg-white text-slate-500 dark:border-white/10 dark:bg-slate-700 dark:text-slate-400'}
									">{competition.status}</span>
								</div>

								<!-- Competition name -->
								<div>
									<p class="text-xs font-medium text-slate-400 dark:text-slate-500">Competition</p>
									<p class="mt-0.5 text-sm font-bold leading-snug text-slate-900 transition group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400">{competition.name}</p>
								</div>

								<!-- Stats row -->
								<div class="grid grid-cols-3 gap-2 border-t border-slate-200 pt-3 dark:border-white/10">
									<div class="text-center">
										<p class="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Score</p>
										<p class="mt-0.5 text-base font-black text-slate-900 dark:text-white">{ranking.rankingScore}</p>
									</div>
									<div class="text-center">
										<p class="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Matches</p>
										<p class="mt-0.5 text-base font-black text-slate-900 dark:text-white">{ranking.matchesPlayed}</p>
									</div>
									<div class="text-center">
										<p class="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Best</p>
										<p class="mt-0.5 text-base font-black text-cyan-600 dark:text-cyan-400">{ranking.highestMatchScore}</p>
									</div>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Matches Section -->
		{#if team && !loading && !error}
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

				{#if tab === 'scheduled'}
					{#if scheduledMatches.length === 0}
						<div class="py-8 text-center text-slate-500 dark:text-slate-400">No upcoming matches</div>
					{:else}
						<div class="grid gap-4 md:grid-cols-2">
							{#each pageItems(scheduledMatches, scheduledPage) as match}
								<button
									type="button"
									onclick={() => (selectedMatchId = match.id)}
									class="cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/80"
								>
									<div class="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
										<span class="font-semibold uppercase tracking-widest">{formatMatchId(match)}</span>
										<span class="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
											{match.status}
										</span>
									</div>

									<div class="grid gap-3 sm:grid-cols-[1fr_auto_1fr] items-center">
										<div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Red alliance</p>
											<div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
												{#each match.redTeamIds as teamId}
														<div
															onclick={(e) => {
																e.stopPropagation();
																navigateToTeam(teamId);
															}}
															onkeydown={(e) => {
																if (e.key === 'Enter' || e.key === ' ') {
																	e.stopPropagation();
																	navigateToTeam(teamId);
																}
															}}
															role="button"
															tabindex="0"
															class="block cursor-pointer text-left transition hover:text-cyan-600 dark:hover:text-cyan-400"
														>
															{teamMap.get(teamId)?.name || 'N/A'}
														</div>
												{/each}
											</div>
										</div>

										<div class="text-center">
											<span class="text-xs font-semibold text-slate-500 dark:text-slate-400">VS</span>
										</div>

										<div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Blue alliance</p>
											<div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
												{#each match.blueTeamIds as teamId}
														<div
															onclick={(e) => {
																e.stopPropagation();
																navigateToTeam(teamId);
															}}
															onkeydown={(e) => {
																if (e.key === 'Enter' || e.key === ' ') {
																	e.stopPropagation();
																	navigateToTeam(teamId);
																}
															}}
															role="button"
															tabindex="0"
															class="block cursor-pointer text-left transition hover:text-cyan-600 dark:hover:text-cyan-400"
														>
															{teamMap.get(teamId)?.name || 'N/A'}
														</div>
												{/each}
											</div>
										</div>
									</div>

									{#if match.scheduledTime}
										<div class="mt-4">
											<p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Scheduled for</p>
											<p class="text-sm font-semibold text-slate-900 dark:text-white">
												{new Date(match.scheduledTime).toLocaleDateString()} at {new Date(match.scheduledTime).toLocaleTimeString()}
											</p>
										</div>
									{/if}
								</button>
							{/each}
						</div>

						<div class="mt-4 flex items-center justify-end gap-2">
							<button
								onclick={() => (scheduledPage = Math.max(1, scheduledPage - 1))}
								disabled={scheduledPage === 1}
								class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200"
							>
								<ChevronLeft size={16} />
							</button>
							<span class="text-sm text-slate-600 dark:text-slate-400">Page {scheduledPage} / {totalPages(scheduledMatches.length)}</span>
							<button
								onclick={() => (scheduledPage = Math.min(totalPages(scheduledMatches.length), scheduledPage + 1))}
								disabled={scheduledPage === totalPages(scheduledMatches.length)}
								class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200"
							>
								<ChevronRight size={16} />
							</button>
						</div>
					{/if}
				{:else}
					{#if finishedMatches.length === 0}
						<div class="py-8 text-center text-slate-500 dark:text-slate-400">No completed matches yet</div>
					{:else}
						<div class="grid gap-4 md:grid-cols-2">
							{#each pageItems(finishedMatches, resultsPage) as match}
								<button
									type="button"
									onclick={() => (selectedMatchId = match.id)}
									class="cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/80"
								>
									<div class="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
										<span class="font-semibold uppercase tracking-widest">{formatMatchId(match)}</span>
									</div>

									<div class="grid gap-3 sm:grid-cols-[1fr_auto_1fr] items-center">
										<div
											class={`rounded-3xl p-4 transition hover:shadow-lg ${
												getMatchWinner(match.id) === 'red'
													? 'border-2 border-red-500 bg-red-50 hover:shadow-red-500/50 dark:bg-red-500/10'
													: 'bg-slate-50 dark:bg-slate-950/70'
											}`}
										>
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
												Red alliance
											</p>
											<div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
												{#each match.redTeamIds as teamId}
													<div
														onclick={(e) => {
															e.stopPropagation();
															navigateToTeam(teamId);
														}}
														onkeydown={(e) => {
															if (e.key === 'Enter' || e.key === ' ') {
																e.stopPropagation();
																navigateToTeam(teamId);
															}
														}}
														role="button"
														tabindex="0"
														class="block cursor-pointer text-left transition hover:text-cyan-600 dark:hover:text-cyan-400"
													>
														{teamMap.get(teamId)?.name || 'N/A'}
													</div>
												{/each}
											</div>
										</div>

										<div class="flex flex-col items-center gap-2">
											<div class="text-center">
												<p class="text-xs font-semibold text-slate-500 dark:text-slate-400">SCORE</p>
												<p class="text-3xl font-bold text-slate-900 dark:text-white">
													{scoresMap.get(match.id)?.red.total ?? 0}
												</p>
											</div>
											<span class="text-xs font-semibold text-slate-500 dark:text-slate-400">—</span>
											<div class="text-center">
												<p class="text-3xl font-bold text-slate-900 dark:text-white">
													{scoresMap.get(match.id)?.blue.total ?? 0}
												</p>
											</div>
										</div>

										<div
											class={`rounded-3xl p-4 transition hover:shadow-lg ${
												getMatchWinner(match.id) === 'blue'
													? 'border-2 border-blue-500 bg-blue-50 hover:shadow-blue-500/50 dark:bg-blue-500/10'
													: 'bg-slate-50 dark:bg-slate-950/70'
											}`}
										>
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
												Blue alliance
											</p>
											<div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
												{#each match.blueTeamIds as teamId}
													<div
														onclick={(e) => {
															e.stopPropagation();
															navigateToTeam(teamId);
														}}
														onkeydown={(e) => {
															if (e.key === 'Enter' || e.key === ' ') {
																e.stopPropagation();
																navigateToTeam(teamId);
															}
														}}
														role="button"
														tabindex="0"
														class="block cursor-pointer text-left transition hover:text-cyan-600 dark:hover:text-cyan-400"
													>
														{teamMap.get(teamId)?.name || 'N/A'}
													</div>
												{/each}
											</div>
										</div>
									</div>

									<div class="mt-4">
										<p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed</p>
										<p class="text-sm font-semibold text-slate-900 dark:text-white">
											{match.endTime ? new Date(match.endTime).toLocaleDateString() : 'No date'}
										</p>
									</div>
								</button>
							{/each}
						</div>

						<div class="mt-4 flex items-center justify-end gap-2">
							<button
								onclick={async () => {
									resultsPage = Math.max(1, resultsPage - 1);
									await loadScoresForCurrentPage();
								}}
								disabled={resultsPage === 1}
								class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200"
							>
								<ChevronLeft size={16} />
							</button>
							<span class="text-sm text-slate-600 dark:text-slate-400">Page {resultsPage} / {totalPages(finishedMatches.length)}</span>
							<button
								onclick={async () => {
									resultsPage = Math.min(totalPages(finishedMatches.length), resultsPage + 1);
									await loadScoresForCurrentPage();
								}}
								disabled={resultsPage === totalPages(finishedMatches.length)}
								class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200"
							>
								<ChevronRight size={16} />
							</button>
						</div>
					{/if}
				{/if}
			</div>
		{/if}

		<!-- Match Details Modal -->
		{#if selectedMatchId && getSelectedMatchDetails()}
			{@const details = getSelectedMatchDetails()}
			{#if details}
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
					<div class="glass-card max-h-screen w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85 dark:shadow-black/20 sm:p-8">
						<div class="mb-6 flex items-center justify-between">
							<div>
								<p class="text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">
									Match Details
								</p>
								<h2 class="text-2xl font-bold text-slate-900 dark:text-white">
									{formatMatchId(details.match)}
								</h2>
							</div>
							<button
								onclick={() => (selectedMatchId = null)}
								class="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
							>
								✕
							</button>
						</div>

						<div class="space-y-4">
							<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
								<div class="mb-4 grid grid-cols-3 gap-4">
									<div class="text-center">
										<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Red Score</p>
										<p class="text-4xl font-bold text-red-600 dark:text-red-400">
											{details.score.red.total}
										</p>
									</div>
									<div class="flex items-center justify-center">
										<p class="text-2xl font-bold text-slate-700 dark:text-slate-300">—</p>
									</div>
									<div class="text-center">
										<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Blue Score</p>
										<p class="text-4xl font-bold text-blue-600 dark:text-blue-400">
											{details.score.blue.total}
										</p>
									</div>
								</div>

								<div class="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4 dark:border-white/10">
									<div>
										<p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Red Breakdown</p>
										<div class="mt-2 space-y-1 text-sm">
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">Tele Independent:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.red.teleIndependent}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">Shared:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.red.sharedScore}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">Endgame:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.red.endgame}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">Multiplier:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.red.endgameMultiplier}x</span>
											</div>
											<div class="flex justify-between border-t border-slate-300 pt-1 dark:border-white/20">
												<span class="text-slate-600 dark:text-slate-300">Penalties:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.red.penalties}</span>
											</div>
										</div>
									</div>

									<div>
										<p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Blue Breakdown</p>
										<div class="mt-2 space-y-1 text-sm">
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">Tele Independent:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.blue.teleIndependent}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">Shared:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.blue.sharedScore}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">Endgame:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.blue.endgame}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">Multiplier:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.blue.endgameMultiplier}x</span>
											</div>
											<div class="flex justify-between border-t border-slate-300 pt-1 dark:border-white/20">
												<span class="text-slate-600 dark:text-slate-300">Penalties:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.blue.penalties}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</section>

<Footer />
