<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api/client';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
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
	const locale = $derived(getLocale() as 'en' | 'vi');
	const text = $derived.by(() =>
		locale === 'vi'
			? {
					loadingTeam: 'Đang tải thông tin đội...',
					teamInformation: 'Thông tin đội',
					name: 'Tên đội',
					school: 'Trường',
					coach: 'Huấn luyện viên',
					robotName: 'Tên robot',
					performance: 'Hiệu suất',
					averageScore: 'Điểm trung bình',
					averageStats: 'Thống kê trung bình',
					totalScore: 'Tổng điểm',
					teleIndependent: 'Tele độc lập',
					endgame: 'Endgame',
					penalty: 'Điểm phạt',
					sharedScore: 'Điểm chung',
					endgameMultiplier: 'Hệ số endgame',
					competitionRankings: 'Xếp hạng giải đấu',
					loadingRankings: 'Đang tải xếp hạng...',
					noRankings: 'Chưa có xếp hạng giải đấu.',
					competition: 'Giải đấu',
					score: 'Điểm',
					matches: 'Trận',
					best: 'Cao nhất',
					upcoming: 'Sắp diễn ra',
					results: 'Kết quả',
					noUpcoming: 'Chưa có trận sắp diễn ra',
					noCompleted: 'Chưa có trận đã hoàn tất',
					redAlliance: 'Liên minh đỏ',
					blueAlliance: 'Liên minh xanh',
					scheduledFor: 'Thời gian dự kiến',
					completed: 'Hoàn tất',
					noDate: 'Chưa có ngày',
					page: 'Trang',
					matchDetails: 'Chi tiết trận đấu',
					redScore: 'Điểm đỏ',
					blueScore: 'Điểm xanh',
					redBreakdown: 'Chi tiết đỏ',
					blueBreakdown: 'Chi tiết xanh',
					shared: 'Điểm chung',
					multiplier: 'Hệ số',
					penalties: 'Phạt'
				}
			: {
					loadingTeam: 'Loading team information...',
					teamInformation: 'Team Information',
					name: 'Name',
					school: 'School',
					coach: 'Coach',
					robotName: 'Robot Name',
					performance: 'Performance',
					averageScore: 'Average score',
					averageStats: 'Average Stats',
					totalScore: 'Total Score',
					teleIndependent: 'Tele Independent',
					endgame: 'Endgame',
					penalty: 'Penalty',
					sharedScore: 'Shared Score',
					endgameMultiplier: 'Endgame Multiplier',
					competitionRankings: 'Competition Rankings',
					loadingRankings: 'Loading rankings...',
					noRankings: 'No competition rankings yet.',
					competition: 'Competition',
					score: 'Score',
					matches: 'Matches',
					best: 'Best',
					upcoming: 'Upcoming',
					results: 'Results',
					noUpcoming: 'No upcoming matches',
					noCompleted: 'No completed matches yet',
					redAlliance: 'Red alliance',
					blueAlliance: 'Blue alliance',
					scheduledFor: 'Scheduled for',
					completed: 'Completed',
					noDate: 'No date',
					page: 'Page',
					matchDetails: 'Match Details',
					redScore: 'Red Score',
					blueScore: 'Blue Score',
					redBreakdown: 'Red Breakdown',
					blueBreakdown: 'Blue Breakdown',
					shared: 'Shared',
					multiplier: 'Multiplier',
					penalties: 'Penalties'
				}
	);

	// Competition rankings
	type CompRanking = { competition: CompetitionResponse; ranking: RankingItem };
	let competitionRankings = $state<CompRanking[]>([]);
	let rankingsLoading = $state(false);

	// Stats
	let teamStats = $state({
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
			totalScore += teamScore.total;
			totalTeleIndependent += teamScore.teleIndependent;
			totalEndgame += teamScore.endgame;
			totalPenalty += teamScore.penalties;
			totalSharedScore += teamScore.sharedScore;
			totalEndgameMultiplier += teamScore.endgameMultiplier;
		});

		teamStats = {
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
				<div class="text-center">{text.loadingTeam}</div>
			{:else if error}
				<div class="text-center text-red-500">{error}</div>
			{:else if team}
				<div class="grid gap-8 md:grid-cols-2">
					<!-- Team Info -->
					<div>
						<p class="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">
							{text.teamInformation}
						</p>
						<h1 class="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
							{team.teamNumber}
						</h1>
						<div class="space-y-3 text-slate-700 dark:text-slate-300">
							<div>
								<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.name}</p>
								<p class="text-lg">{team.name || 'N/A'}</p>
							</div>
							<div>
								<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.school}</p>
								<p class="text-lg">{team.school || 'N/A'}</p>
							</div>
							<div>
								<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.coach}</p>
								<p class="text-lg">{team.coach || 'N/A'}</p>
							</div>
							<div>
								<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.robotName}</p>
								<p class="text-lg">{team.robotName || 'N/A'}</p>
							</div>
						</div>
					</div>

					<!-- Stats Summary -->
					<div>
						<p class="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">
							{text.performance}
						</p>
						<div class="grid grid-cols-2 gap-4">
							<div class="col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
								<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.averageScore}</p>
								<p class="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
									{teamStats.avgScore.toFixed(1)}
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
					{text.averageStats}
				</p>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.totalScore}</p>
						<p class="text-2xl font-bold text-slate-900 dark:text-white">
							{teamStats.avgScore.toFixed(1)}
						</p>
					</div>
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.teleIndependent}</p>
						<p class="text-2xl font-bold text-slate-900 dark:text-white">
							{teamStats.avgTeleIndependent.toFixed(1)}
						</p>
					</div>
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.endgame}</p>
						<p class="text-2xl font-bold text-slate-900 dark:text-white">
							{teamStats.avgEndgame.toFixed(1)}
						</p>
					</div>
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.penalty}</p>
						<p class="text-2xl font-bold text-slate-900 dark:text-white">
							{teamStats.avgPenalty.toFixed(1)}
						</p>
					</div>
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.sharedScore}</p>
						<p class="text-2xl font-bold text-slate-900 dark:text-white">
							{teamStats.avgSharedScore.toFixed(1)}
						</p>
					</div>
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.endgameMultiplier}</p>
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
						{text.competitionRankings}
					</p>
				</div>

				{#if rankingsLoading}
					<div class="py-8 text-center text-slate-500 dark:text-slate-400">{text.loadingRankings}</div>
				{:else if competitionRankings.length === 0}
					<div class="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-white/10 dark:bg-slate-800/40">
						<div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
							<Trophy class="h-6 w-6 text-slate-400" />
						</div>
						<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.noRankings}</p>
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
									<p class="text-xs font-medium text-slate-400 dark:text-slate-500">{text.competition}</p>
									<p class="mt-0.5 text-sm font-bold leading-snug text-slate-900 transition group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400">{competition.name}</p>
								</div>

								<!-- Stats row -->
								<div class="grid grid-cols-3 gap-2 border-t border-slate-200 pt-3 dark:border-white/10">
									<div class="text-center">
										<p class="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{text.score}</p>
										<p class="mt-0.5 text-base font-black text-slate-900 dark:text-white">{ranking.rankingScore}</p>
									</div>
									<div class="text-center">
										<p class="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{text.matches}</p>
										<p class="mt-0.5 text-base font-black text-slate-900 dark:text-white">{ranking.matchesPlayed}</p>
									</div>
									<div class="text-center">
										<p class="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{text.best}</p>
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
				</div>

				{#if tab === 'scheduled'}
					{#if scheduledMatches.length === 0}
						<div class="py-8 text-center text-slate-500 dark:text-slate-400">{text.noUpcoming}</div>
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
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">{text.redAlliance}</p>
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
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">{text.blueAlliance}</p>
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
											<p class="text-xs font-semibold text-slate-500 dark:text-slate-400">{text.scheduledFor}</p>
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
							<span class="text-sm text-slate-600 dark:text-slate-400">{text.page} {scheduledPage} / {totalPages(scheduledMatches.length)}</span>
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
						<div class="py-8 text-center text-slate-500 dark:text-slate-400">{text.noCompleted}</div>
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
											class="rounded-3xl bg-slate-50 p-4 transition hover:shadow-lg hover:shadow-red-500/50 dark:bg-slate-950/70"
										>
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
												{text.redAlliance}
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
												<p class="text-xs font-semibold text-slate-500 dark:text-slate-400">{text.score}</p>
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
											class="rounded-3xl bg-slate-50 p-4 transition hover:shadow-lg hover:shadow-blue-500/50 dark:bg-slate-950/70"
										>
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
												{text.blueAlliance}
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
										<p class="text-xs font-semibold text-slate-500 dark:text-slate-400">{text.completed}</p>
										<p class="text-sm font-semibold text-slate-900 dark:text-white">
											{match.endTime ? new Date(match.endTime).toLocaleDateString() : text.noDate}
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
							<span class="text-sm text-slate-600 dark:text-slate-400">{text.page} {resultsPage} / {totalPages(finishedMatches.length)}</span>
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
									{text.matchDetails}
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
										<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.redScore}</p>
										<p class="text-4xl font-bold text-red-600 dark:text-red-400">
											{details.score.red.total}
										</p>
									</div>
									<div class="flex items-center justify-center">
										<p class="text-2xl font-bold text-slate-700 dark:text-slate-300">—</p>
									</div>
									<div class="text-center">
										<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.blueScore}</p>
										<p class="text-4xl font-bold text-blue-600 dark:text-blue-400">
											{details.score.blue.total}
										</p>
									</div>
								</div>

								<div class="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4 dark:border-white/10">
									<div>
										<p class="text-xs font-semibold text-slate-500 dark:text-slate-400">{text.redBreakdown}</p>
										<div class="mt-2 space-y-1 text-sm">
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">{text.teleIndependent}:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.red.teleIndependent}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">{text.shared}:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.red.sharedScore}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">{text.endgame}:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.red.endgame}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">{text.multiplier}:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.red.endgameMultiplier}x</span>
											</div>
											<div class="flex justify-between border-t border-slate-300 pt-1 dark:border-white/20">
												<span class="text-slate-600 dark:text-slate-300">{text.penalties}:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.red.penalties}</span>
											</div>
										</div>
									</div>

									<div>
										<p class="text-xs font-semibold text-slate-500 dark:text-slate-400">{text.blueBreakdown}</p>
										<div class="mt-2 space-y-1 text-sm">
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">{text.teleIndependent}:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.blue.teleIndependent}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">{text.shared}:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.blue.sharedScore}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">{text.endgame}:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.blue.endgame}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-slate-600 dark:text-slate-300">{text.multiplier}:</span>
												<span class="font-semibold text-slate-900 dark:text-white">{details.score.blue.endgameMultiplier}x</span>
											</div>
											<div class="flex justify-between border-t border-slate-300 pt-1 dark:border-white/20">
												<span class="text-slate-600 dark:text-slate-300">{text.penalties}:</span>
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
