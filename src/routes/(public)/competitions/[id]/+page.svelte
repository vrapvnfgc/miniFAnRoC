<script lang="ts">
    import Navbar from '$lib/components/layout/Navbar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { api } from '$lib/api';
    import type { MatchScoreResponse } from '$lib/api/scores.api';
    import { Trophy, Users, Swords, BarChart3, Calendar, Clock } from 'lucide-svelte';

    let { data }: { data: PageData } = $props();

    let matchScores = $state<Record<string, { redScore: number; blueScore: number }>>({});
    let selectedMatchId: string | null = $state(null);
    let selectedMatchDetails: { match?: any; score?: MatchScoreResponse | null } | null = $state(null);
    let rankings = $state<any[]>([]);
    let rankingsLoading = $state(false);
    let activeTab = $state<'teams' | 'matches' | 'rankings'>('teams');

    $effect(() => {
        rankings = data?.rankings || [];
    });

    function getTeamName(teamId: string) {
        const team = (data.teams || []).find((t: any) => t.id === teamId);
        return team ? `${team.teamNumber} - ${team.name}` : 'Unknown Team';
    }

    async function navigateToTeam(teamId: string) {
        const team = (data.teams || []).find((t: any) => t.id === teamId);
        if (team) await goto(`/teams/${team.teamNumber}`);
    }

    function getFieldName(fieldId: string) {
        const field = (data.fields || []).find((f: any) => f.id === fieldId);
        return field ? field.name : 'Unknown Field';
    }

    const finishedMatches = $derived.by(() => {
        return (data.matches || []).filter((m: any) => m.status === 'finished').sort((a: any, b: any) => {
            return new Date(b.endTime || b.updatedAt).getTime() - new Date(a.endTime || a.updatedAt).getTime();
        });
    });

    const unplayedMatches = $derived.by(() => {
        return (data.matches || []).filter((m: any) => m.status !== 'finished').sort((a: any, b: any) => {
            if (!a.scheduledTime && !b.scheduledTime) return 0;
            if (!a.scheduledTime) return 1;
            if (!b.scheduledTime) return -1;
            return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
        });
    });

    async function loadScores() {
        const scores: Record<string, { redScore: number; blueScore: number }> = {};
        for (const match of finishedMatches) {
            try {
                const scoreRes = await api.scores.getByMatchId(match.id);
                if (scoreRes.data?.score) {
                    scores[match.id] = {
                        redScore: scoreRes.data.score.red.total || 0,
                        blueScore: scoreRes.data.score.blue.total || 0
                    };
                } else {
                    scores[match.id] = { redScore: 0, blueScore: 0 };
                }
            } catch {
                scores[match.id] = { redScore: 0, blueScore: 0 };
            }
        }
        matchScores = scores;
    }

    function getScoreDisplay(matchId: string) {
        const s = matchScores[matchId];
        if (!s) return '—';
        return `${s.redScore} — ${s.blueScore}`;
    }

    function getMatchWinner(matchId: string) {
        const s = matchScores[matchId];
        if (!s) return 'draw';
        if (s.redScore > s.blueScore) return 'red';
        if (s.blueScore > s.redScore) return 'blue';
        return 'draw';
    }

    async function openDetails(match: any) {
        selectedMatchId = match.id;
        selectedMatchDetails = null;
        try {
            const res = await api.scores.getByMatchId(match.id);
            selectedMatchDetails = { match, score: res.data?.score || null };
        } catch {
            selectedMatchDetails = { match, score: null };
        }
    }

    function closeDetails() {
        selectedMatchId = null;
        selectedMatchDetails = null;
    }

    async function loadRankings() {
        if (!data?.competition?.id) return;
        rankingsLoading = true;
        try {
            const res = await api.competitions.getRankings(data.competition.id, true);
            rankings = res.data?.rankings || [];
        } catch {
            rankings = [];
        } finally {
            rankingsLoading = false;
        }
    }

    onMount(async () => {
        await loadScores();
        if ((rankings || []).length === 0) await loadRankings();
    });

    function formatMatchId(match: any) {
        return `${match.phase.toUpperCase()}-${String(match.matchNumber).padStart(2, '0')}`;
    }

    const tabs = [
        { id: 'teams', label: 'Teams', icon: Users },
        { id: 'matches', label: 'Matches', icon: Swords },
        { id: 'rankings', label: 'Rankings', icon: BarChart3 }
    ] as const;
</script>

<svelte:head>
    <title>{data.competition?.name || 'Competition'} · miniFAnRoC</title>
    <meta name="description" content={data.competition?.description || 'Competition details, teams, matches and rankings.'} />
</svelte:head>

<Navbar />

<section class="relative overflow-hidden bg-slate-50 py-20 dark:bg-slate-950">
    <!-- Ambient blobs -->
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"></div>
        <div class="absolute right-0 top-20 h-60 w-60 rounded-full bg-purple-400/10 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl"></div>
    </div>

    <div class="mx-auto max-w-6xl px-6">

        <!-- Header card -->
        <div class="mb-8 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-10">
            <div class="flex flex-col gap-4">
                <a href="/competitions" class="inline-flex w-fit items-center gap-1.5 text-xs font-semibold tracking-[0.15em] text-cyan-600 uppercase transition hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300">
                    ← All Competitions
                </a>
                <div>
                    <p class="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">
                        Competition Details
                    </p>
                    <h1 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        {data.competition?.name || 'Competition'}
                    </h1>
                    {#if data.competition?.description}
                        <p class="mt-3 text-base text-slate-500 dark:text-slate-400">{data.competition.description}</p>
                    {/if}
                </div>

                <!-- Stats row -->
                <div class="mt-2 flex flex-wrap gap-3">
                    <div class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-white/10 dark:bg-slate-800/60">
                        <Users class="h-4 w-4 text-cyan-500" />
                        <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">{data.teams?.length || 0} Teams</span>
                    </div>
                    <div class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-white/10 dark:bg-slate-800/60">
                        <Swords class="h-4 w-4 text-purple-500" />
                        <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">{data.matches?.length || 0} Matches</span>
                    </div>
                    {#if data.competition?.startDate}
                        <div class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-white/10 dark:bg-slate-800/60">
                            <Calendar class="h-4 w-4 text-emerald-500" />
                            <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {new Date(data.competition.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        {#if data.error}
            <div class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <p class="font-semibold">{data.error}</p>
            </div>
        {/if}

        <!-- Tab nav + content card -->
        <div class="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-8">

            <!-- Tab buttons -->
            <div class="mb-8 flex flex-wrap gap-2">
                {#each tabs as tab}
                    <button
                        type="button"
                        onclick={() => (activeTab = tab.id)}
                        class={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                    >
                        <svelte:component this={tab.icon} class="h-4 w-4" />
                        {tab.label}
                    </button>
                {/each}
            </div>

            <!-- TEAMS TAB -->
            {#if activeTab === 'teams'}
                {#if data.teams.length === 0}
                    <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center dark:border-white/10 dark:bg-slate-800/40">
                        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
                            <Users class="h-7 w-7 text-slate-400" />
                        </div>
                        <p class="font-semibold text-slate-600 dark:text-slate-300">No teams registered yet.</p>
                    </div>
                {:else}
                    <div class="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10">
                        <!-- Table header -->
                        <div class="grid grid-cols-[3rem_1fr_2fr_2fr] gap-0 border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-white/10 dark:bg-slate-800/60">
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">#</span>
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Team #</span>
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Name</span>
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">School</span>
                        </div>
                        {#each data.teams as team, i (team.id)}
                            <button
                                type="button"
                                onclick={() => goto(`/teams/${team.teamNumber}`)}
                                class="grid w-full grid-cols-[3rem_1fr_2fr_2fr] items-center gap-0 border-b border-slate-100 px-5 py-4 text-left transition-colors last:border-0 hover:bg-cyan-50 dark:border-white/5 dark:hover:bg-cyan-500/5"
                            >
                                <span class="text-sm text-slate-400 dark:text-slate-500">{i + 1}</span>
                                <span class="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">{team.teamNumber}</span>
                                <span class="text-sm font-semibold text-slate-900 transition group-hover:text-cyan-600 dark:text-white">{team.name}</span>
                                <span class="text-sm text-slate-500 dark:text-slate-400">{team.school || '—'}</span>
                            </button>
                        {/each}
                    </div>
                {/if}

            <!-- MATCHES TAB -->
            {:else if activeTab === 'matches'}
                {#if data.matches.length === 0}
                    <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center dark:border-white/10 dark:bg-slate-800/40">
                        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
                            <Swords class="h-7 w-7 text-slate-400" />
                        </div>
                        <p class="font-semibold text-slate-600 dark:text-slate-300">No matches yet.</p>
                    </div>
                {:else}
                    <div class="space-y-8">
                        <!-- Finished matches -->
                        {#if finishedMatches.length > 0}
                            <div>
                                <p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Results</p>
                                <div class="grid gap-4 md:grid-cols-2">
                                    {#each finishedMatches as match}
                                        <article class="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-800/40">
                                            <div class="mb-4 flex items-center justify-between gap-3">
                                                <span class="font-mono text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{formatMatchId(match)}</span>
                                                <div class="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 shadow-sm dark:bg-slate-700 dark:text-slate-300">
                                                    {getFieldName(match.fieldId)}
                                                </div>
                                            </div>
                                            <p class="mb-4 text-xs text-slate-400 dark:text-slate-500">
                                                {match.endTime ? new Date(match.endTime).toLocaleString() : 'N/A'}
                                            </p>

                                            <div class="grid gap-3 sm:grid-cols-[1fr_auto_1fr] items-center">
                                                <div class={`rounded-2xl p-4 transition ${getMatchWinner(match.id) === 'red' ? 'border-2 border-red-400 bg-red-50 dark:border-red-500/50 dark:bg-red-500/10' : 'border border-slate-200 bg-white dark:border-white/5 dark:bg-slate-900/60'}`}>
                                                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Red</p>
                                                    <div class="mt-2 space-y-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                                                        {#each match.redTeamIds as teamId}
                                                            <button type="button" onclick={() => navigateToTeam(teamId)} class="block text-left transition hover:text-cyan-600 dark:hover:text-cyan-400">{getTeamName(teamId)}</button>
                                                        {/each}
                                                    </div>
                                                </div>

                                                <div class="flex flex-col items-center justify-center gap-1 rounded-2xl bg-slate-900 px-4 py-5 text-white dark:bg-white/10">
                                                    <p class="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-300">Final</p>
                                                    <p class="text-xl font-black">{getScoreDisplay(match.id)}</p>
                                                    <p class={`text-[10px] font-bold ${getMatchWinner(match.id) === 'red' ? 'text-red-400' : getMatchWinner(match.id) === 'blue' ? 'text-sky-400' : 'text-slate-400'}`}>
                                                        {getMatchWinner(match.id) === 'red' ? 'Red ✓' : getMatchWinner(match.id) === 'blue' ? 'Blue ✓' : 'Draw'}
                                                    </p>
                                                </div>

                                                <div class={`rounded-2xl p-4 transition ${getMatchWinner(match.id) === 'blue' ? 'border-2 border-sky-400 bg-blue-50 dark:border-sky-500/50 dark:bg-blue-500/10' : 'border border-slate-200 bg-white dark:border-white/5 dark:bg-slate-900/60'}`}>
                                                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Blue</p>
                                                    <div class="mt-2 space-y-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                                                        {#each match.blueTeamIds as teamId}
                                                            <button type="button" onclick={() => navigateToTeam(teamId)} class="block text-left transition hover:text-cyan-600 dark:hover:text-cyan-400">{getTeamName(teamId)}</button>
                                                        {/each}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onclick={() => openDetails(match)}
                                                class="mt-4 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white/10 dark:hover:bg-white/20"
                                            >
                                                View Details
                                            </button>
                                        </article>
                                    {/each}
                                </div>
                            </div>
                        {/if}

                        <!-- Upcoming matches -->
                        {#if unplayedMatches.length > 0}
                            <div>
                                <p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Upcoming</p>
                                <div class="grid gap-4 md:grid-cols-2">
                                    {#each unplayedMatches as match}
                                        <article class="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-800/40">
                                            <div class="mb-4 flex items-center justify-between gap-3">
                                                <span class="font-mono text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{formatMatchId(match)}</span>
                                                <div class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                    <Clock class="h-3.5 w-3.5" />
                                                    <span>{match.scheduledTime ? new Date(match.scheduledTime).toLocaleString() : 'TBD'}</span>
                                                </div>
                                            </div>
                                            <div class="grid gap-3 sm:grid-cols-2">
                                                <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-slate-900/60">
                                                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Red</p>
                                                    <div class="mt-2 space-y-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                                                        {#each match.redTeamIds as teamId}
                                                            <button type="button" onclick={() => navigateToTeam(teamId)} class="block text-left transition hover:text-cyan-600 dark:hover:text-cyan-400">{getTeamName(teamId)}</button>
                                                        {/each}
                                                    </div>
                                                </div>
                                                <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-slate-900/60">
                                                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Blue</p>
                                                    <div class="mt-2 space-y-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                                                        {#each match.blueTeamIds as teamId}
                                                            <button type="button" onclick={() => navigateToTeam(teamId)} class="block text-left transition hover:text-cyan-600 dark:hover:text-cyan-400">{getTeamName(teamId)}</button>
                                                        {/each}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/if}

            <!-- RANKINGS TAB -->
            {:else if activeTab === 'rankings'}
                {#if rankingsLoading}
                    <div class="py-12 text-center text-slate-500 dark:text-slate-400">Loading rankings…</div>
                {:else if rankings.length === 0}
                    <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center dark:border-white/10 dark:bg-slate-800/40">
                        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
                            <BarChart3 class="h-7 w-7 text-slate-400" />
                        </div>
                        <p class="font-semibold text-slate-600 dark:text-slate-300">No rankings available yet.</p>
                    </div>
                {:else}
                    <div class="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10">
                        <!-- Table header -->
                        <div class="grid grid-cols-[3.5rem_3.5rem_1fr_5rem_5rem_6rem] gap-0 border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-white/10 dark:bg-slate-800/60">
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Rank</span>
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">No.</span>
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Team</span>
                            <span class="text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Matches</span>
                            <span class="text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Score</span>
                            <span class="text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Highest</span>
                        </div>
                        {#each rankings as r, i}
                            <button
                                type="button"
                                onclick={() => goto(`/teams/${r.teamNumber}`)}
                                class={`grid w-full grid-cols-[3.5rem_3.5rem_1fr_5rem_5rem_6rem] items-center gap-0 border-b border-slate-100 px-5 py-4 text-left transition-colors last:border-0 hover:bg-cyan-50 dark:border-white/5 dark:hover:bg-cyan-500/5 ${i === 0 ? 'bg-amber-50/60 dark:bg-amber-500/5' : ''}`}
                            >
                                <span class={`text-sm font-black ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : r.rank}
                                </span>
                                <span class="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">{r.teamNumber}</span>
                                <span class="text-sm font-semibold text-slate-900 dark:text-white">{r.teamName}</span>
                                <span class="text-right text-sm text-slate-500 dark:text-slate-400">{r.matchesPlayed}</span>
                                <span class="text-right text-sm font-bold text-slate-700 dark:text-slate-200">{r.rankingScore}</span>
                                <span class="text-right text-sm text-slate-500 dark:text-slate-400">{r.highestMatchScore}</span>
                            </button>
                        {/each}
                    </div>
                {/if}
            {/if}

        </div>
    </div>
</section>

<!-- Score details modal -->
{#if selectedMatchId && selectedMatchDetails}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div class="max-h-screen w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 sm:p-8">
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">Match Details</p>
                    <h2 class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                        {selectedMatchDetails.match.phase.toUpperCase()}-{String(selectedMatchDetails.match.matchNumber).padStart(2, '0')}
                    </h2>
                </div>
                <button
                    onclick={closeDetails}
                    title="Close"
                    class="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-800/60">
                <div class="grid gap-6 sm:grid-cols-2">
                    <!-- Red Alliance -->
                    <div>
                        <h3 class="mb-3 text-sm font-bold text-red-600 dark:text-red-400">Red Alliance</h3>
                        <div class="space-y-2 text-sm">
                            {#each [['Tele Independent', selectedMatchDetails.score?.red.teleIndependent], ['Shared', selectedMatchDetails.score?.red.sharedScore], ['Penalties', selectedMatchDetails.score?.red.penalties], ['Endgame', selectedMatchDetails.score?.red.endgame], ['Balance Mult', selectedMatchDetails.score?.red.balanceMultiplier]] as [label, val]}
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">{label}:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{val ?? 'N/A'}</span>
                                </div>
                            {/each}
                            <div class="border-t border-slate-200 pt-2 dark:border-white/10">
                                <div class="flex justify-between">
                                    <span class="font-bold text-red-600 dark:text-red-400">Total:</span>
                                    <span class="text-lg font-black text-red-600 dark:text-red-400">{selectedMatchDetails.score?.red.total ?? 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Blue Alliance -->
                    <div>
                        <h3 class="mb-3 text-sm font-bold text-sky-600 dark:text-sky-400">Blue Alliance</h3>
                        <div class="space-y-2 text-sm">
                            {#each [['Tele Independent', selectedMatchDetails.score?.blue.teleIndependent], ['Shared', selectedMatchDetails.score?.blue.sharedScore], ['Penalties', selectedMatchDetails.score?.blue.penalties], ['Endgame', selectedMatchDetails.score?.blue.endgame], ['Balance Mult', selectedMatchDetails.score?.blue.balanceMultiplier]] as [label, val]}
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">{label}:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{val ?? 'N/A'}</span>
                                </div>
                            {/each}
                            <div class="border-t border-slate-200 pt-2 dark:border-white/10">
                                <div class="flex justify-between">
                                    <span class="font-bold text-sky-600 dark:text-sky-400">Total:</span>
                                    <span class="text-lg font-black text-sky-600 dark:text-sky-400">{selectedMatchDetails.score?.blue.total ?? 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<Footer />
