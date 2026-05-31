<script lang="ts">
  import { Clock, MapPin, ArrowRight, Zap } from 'lucide-svelte';
  import * as m from '$lib/paraglide/messages';
  import { api } from '$lib/api/client';
  import type { MatchResponse, MatchStatus } from '$lib/api/matches.api';
  import type { MatchScoreResponse } from '$lib/api/scores.api';
  import type { TeamResponse } from '$lib/api/teams.api';
  import type { FieldResponse } from '$lib/api/fields.api';
  import { onMount } from 'svelte';

	let recentMatches = $state<
		Array<{
			id: string;
			redTeams: string[];
			blueTeams: string[];
			scoreA: number;
			scoreB: number;
			region: string;
			time: string;
			result: 'red' | 'blue' | 'draw';
		}>
	>([]);

	let upcomingMatches = $state<
		Array<{
			id: string;
			redTeams: string[];
			blueTeams: string[];
			region: string;
			time: string;
			date: string;
		}>
	>([]);

  let loading = $state(true);
  let error = $state<string | null>(null);

  async function loadMatches() {
    try {
      loading = true;
      error = null;

      // Fetch all matches, teams, and fields
      const [matchesRes, teamsRes, fieldsRes] = await Promise.all([
        api.matches.getAll(),
        api.teams.getAll(),
        api.fields.getAll()
      ]);

      if (!matchesRes.data?.matches || !teamsRes.data?.teams || !fieldsRes.data?.fields) {
        throw new Error('Invalid API response');
      }

      const matches = matchesRes.data.matches;
      const teams = teamsRes.data.teams;
      const fields = fieldsRes.data.fields;
      const teamMap = new Map<string, TeamResponse>(teams.map((t) => [t.id, t]));
      const fieldMap = new Map<string, FieldResponse>(fields.map((f) => [f.id, f]));

      // Get finished matches (last 2)
      const finishedMatches = matches
        .filter((m) => m.status === 'finished')
        .sort((a, b) => new Date(b.endTime || b.updatedAt).getTime() - new Date(a.endTime || a.updatedAt).getTime())
        .slice(0, 2);

      // Fetch scores and format recent matches
      const recentMatchesData = await Promise.all(
        finishedMatches.map(async (match) => {
          try {
            const scoreRes = await api.scores.getByMatchId(match.id);
            const score = scoreRes.data?.score;

						const redTeams = match.redTeamIds.map(id => teamMap.get(id)?.name || 'N/A');
						const blueTeams = match.blueTeamIds.map(id => teamMap.get(id)?.name || 'N/A');
						const scoreA = score?.red?.total || 0;
						const scoreB = score?.blue?.total || 0;
						const region = fieldMap.get(match.fieldId)?.name || 'N/A';

            const result: 'red' | 'blue' | 'draw' = scoreA > scoreB ? 'red' : scoreB > scoreA ? 'blue' : 'draw';

            const endTime = match.endTime ? new Date(match.endTime) : new Date(match.updatedAt);
            const time = endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

						return {
							id: `${match.phase.toUpperCase()}-${String(match.matchNumber).padStart(2, '0')}`,
							redTeams,
							blueTeams,
							scoreA,
							scoreB,
							region,
							time,
							result
						};
					} catch (err) {
						console.error(`Error fetching score for match ${match.id}:`, err);
						const redTeams = match.redTeamIds.map(id => teamMap.get(id)?.name || 'N/A');
						const blueTeams = match.blueTeamIds.map(id => teamMap.get(id)?.name || 'N/A');
						const region = fieldMap.get(match.fieldId)?.name || 'N/A';

						return {
							id: `${match.phase.toUpperCase()}-${String(match.matchNumber).padStart(2, '0')}`,
							redTeams,
							blueTeams,
							scoreA: 0,
							scoreB: 0,
							region,
							time: 'N/A',
							result: 'draw' as const
						};
					}
				})
			);

      recentMatches = recentMatchesData;

      // Get upcoming matches (next 3 queued or scheduled)
      const upcomingMatchesList = matches
        .filter((m) => m.status === 'queued' || m.status === 'scheduled')
        .sort((a, b) => {
          const timeA = a.scheduledTime ? new Date(a.scheduledTime).getTime() : Infinity;
          const timeB = b.scheduledTime ? new Date(b.scheduledTime).getTime() : Infinity;
          return timeA - timeB;
        })
        .slice(0, 3);

			const upcomingMatchesData = upcomingMatchesList.map((match) => {
				const redTeams = match.redTeamIds.map(id => teamMap.get(id)?.name || 'N/A');
				const blueTeams = match.blueTeamIds.map(id => teamMap.get(id)?.name || 'N/A');
				const region = fieldMap.get(match.fieldId)?.name || 'N/A';

        const scheduledDate = match.scheduledTime ? new Date(match.scheduledTime) : new Date();
        const date = scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const time = scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

				return {
					id: `${match.phase.toUpperCase()}-${String(match.matchNumber).padStart(2, '0')}`,
					redTeams,
					blueTeams,
					region,
					time,
					date
				};
			});

			upcomingMatches = upcomingMatchesData;
		} catch (err) {
			console.error('Error loading matches:', err);
			error = err instanceof Error ? err.message : 'Failed to load matches';
			// Set default values on error
			recentMatches = [
				{
					id: 'N/A',
					redTeams: ['N/A', 'N/A'],
					blueTeams: ['N/A', 'N/A'],
					scoreA: 0,
					scoreB: 0,
					region: 'N/A',
					time: 'N/A',
					result: 'draw'
				},
				{
					id: 'N/A',
					redTeams: ['N/A', 'N/A'],
					blueTeams: ['N/A', 'N/A'],
					scoreA: 0,
					scoreB: 0,
					region: 'N/A',
					time: 'N/A',
					result: 'draw'
				}
			];
			upcomingMatches = [
				{ id: 'N/A', redTeams: ['N/A', 'N/A'], blueTeams: ['N/A', 'N/A'], region: 'N/A', time: 'N/A', date: 'N/A' },
				{ id: 'N/A', redTeams: ['N/A', 'N/A'], blueTeams: ['N/A', 'N/A'], region: 'N/A', time: 'N/A', date: 'N/A' },
				{ id: 'N/A', redTeams: ['N/A', 'N/A'], blueTeams: ['N/A', 'N/A'], region: 'N/A', time: 'N/A', date: 'N/A' }
			];
		} finally {
			loading = false;
		}
	}

  onMount(() => {
    loadMatches();
  });
</script>

<section class="px-6 py-28">
  <div class="mx-auto max-w-7xl">
    <div class="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div>
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{m.matches_label()}</p>
        <h2 class="text-4xl font-black text-slate-900 dark:text-white">{m.matches_title()}</h2>
      </div>
      <a href="/matches" class="group inline-flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/10">
        {m.btn_view_all_matches()} <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </a>
    </div>

		<!-- Recent -->
		<h3
			class="mb-5 text-sm font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500"
		>
			{m.matches_recent_results()}
		</h3>
		<div class="mb-10 grid gap-4 md:grid-cols-2">
			{#each recentMatches as match}
				<div
					class="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] dark:shadow-none"
				>
					<div class="mb-4 flex items-center justify-between">
						<span
							class="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400"
							>{match.id}</span
						>
						<div class="flex items-center gap-1.5 text-xs text-slate-400">
							<MapPin class="h-3.5 w-3.5" />{match.region}
						</div>
					</div>
					<div class="flex items-center justify-between gap-4">
						<div class="flex-1 text-right">
							<div class="mb-2 space-y-1">
								{#each match.redTeams as team}
									<p
										class="text-sm font-bold {match.result === 'red'
											? 'text-green-600 dark:text-green-400'
											: 'text-slate-700 dark:text-white'}"
									>
										{team}
									</p>
								{/each}
							</div>
							<p
								class="text-3xl font-black {match.result === 'red'
									? 'text-green-600 dark:text-green-400'
									: 'text-slate-400 dark:text-slate-500'}"
							>
								{match.scoreA}
							</p>
						</div>
						<div class="shrink-0 text-center">
							<div
								class="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 dark:border-white/10 dark:bg-white/5"
							>
								<p class="text-xs text-slate-400">FINAL</p>
								<p class="text-lg font-black text-slate-600 dark:text-white">VS</p>
							</div>
						</div>
						<div class="flex-1">
							<div class="mb-2 space-y-1">
								{#each match.blueTeams as team}
									<p
										class="text-sm font-bold {match.result === 'blue'
											? 'text-green-600 dark:text-green-400'
											: 'text-slate-700 dark:text-white'}"
									>
										{team}
									</p>
								{/each}
							</div>
							<p
								class="text-3xl font-black {match.result === 'blue'
									? 'text-green-600 dark:text-green-400'
									: 'text-slate-400 dark:text-slate-500'}"
							>
								{match.scoreB}
							</p>
						</div>
					</div>
					<div class="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
						<Clock class="h-3.5 w-3.5" />{match.time}
					</div>
				</div>
			{/each}
		</div>

		<!-- Upcoming -->
		<h3
			class="mb-5 text-sm font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500"
		>
			{m.matches_upcoming()}
		</h3>
		<div class="grid gap-5 lg:grid-cols-3">
			{#each upcomingMatches as match}
				<div
					class="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.02] dark:shadow-none dark:hover:border-white/20"
				>
					<div class="mb-5 flex items-center justify-between">
						<div
							class="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-400"
						>
							<Zap class="h-3 w-3" /> Upcoming
						</div>
						<span class="font-mono text-sm text-slate-400">{match.id}</span>
					</div>
					<div class="mb-5 flex items-center justify-between gap-2 text-center">
						<div class="flex-1">
							<div
								class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
							>
								<span class="text-xs font-bold text-red-600 dark:text-red-400">RED</span>
							</div>
							<div class="space-y-1">
								{#each match.redTeams as team}
									<p class="text-xs font-bold text-slate-800 dark:text-white">{team}</p>
								{/each}
							</div>
						</div>
						<div class="text-lg font-black text-slate-300 dark:text-slate-600">VS</div>
						<div class="flex-1">
							<div
								class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-300 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10"
							>
								<span class="text-xs font-bold text-blue-600 dark:text-blue-400">BLU</span>
							</div>
							<div class="space-y-1">
								{#each match.blueTeams as team}
									<p class="text-xs font-bold text-slate-800 dark:text-white">{team}</p>
								{/each}
							</div>
						</div>
					</div>
					<div
						class="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-white/5"
					>
						<div class="flex items-center gap-1.5">
							<MapPin class="h-3.5 w-3.5" />{match.region}
						</div>
						<div class="flex items-center gap-1.5">
							<Clock class="h-3.5 w-3.5" />{match.date} · {match.time}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
