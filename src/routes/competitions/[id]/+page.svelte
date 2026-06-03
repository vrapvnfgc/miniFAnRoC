<script lang="ts">
    import * as Table from '$lib/components/ui/table/index.js';
    import Navbar from '$lib/components/layout/Navbar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import * as Tabs from '$lib/components/ui/tabs/index.js';
    import { api } from '$lib/api';
    import type { MatchScoreResponse } from '$lib/api/scores.api';

    let { data }: { data: PageData } = $props();

    let matchScores = $state<Record<string, { redScore: number; blueScore: number }>>({});
    let selectedMatchId: string | null = $state(null);
    let selectedMatchDetails: { match?: any; score?: MatchScoreResponse | null } | null = $state(null);
    let rankings = $state<any[]>([]);
    let rankingsLoading = $state(false);

    $effect(() => {
        rankings = data?.rankings || [];
    });

    function getTeamName(teamId: string) {
        const team = (data.teams || []).find((t: any) => t.id === teamId);
        return team ? `${team.teamNumber} - ${team.name}` : 'Unknown Team';
    }

    function getFieldName(fieldId: string) {
        const field = (data.fields || []).find((f: any) => f.id === fieldId);
        return field ? field.name : 'Unknown Field';
    }

    const finishedMatches = $derived.by(() => {
        return (data.matches || []).filter((m: any) => m.status === 'finished').sort((a: any, b: any) => {
            const timeA = new Date(b.endTime || b.updatedAt).getTime();
            const timeB = new Date(a.endTime || a.updatedAt).getTime();
            return timeA - timeB;
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
                if (scoreRes.data && scoreRes.data.score) {
                    scores[match.id] = {
                        redScore: scoreRes.data.score.red.total || 0,
                        blueScore: scoreRes.data.score.blue.total || 0
                    };
                } else {
                    scores[match.id] = { redScore: 0, blueScore: 0 };
                }
            } catch (err) {
                console.error('Failed to load score for match:', match.id, err);
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
        } catch (err) {
            console.error('Failed to load score details:', err);
            selectedMatchDetails = { match, score: null };
        }
    }

    function closeDetails() {
        selectedMatchId = null;
        selectedMatchDetails = null;
    }

    onMount(async () => {
        await loadScores();
        if ((rankings || []).length === 0) await loadRankings();
    });

    async function loadRankings() {
        if (!data?.competition?.id) return;
        rankingsLoading = true;
        try {
            const res = await api.competitions.getRankings(data.competition.id, true);
            rankings = res.data?.rankings || [];
        } catch (err) {
            console.error('Failed to load rankings:', err);
            rankings = [];
        } finally {
            rankingsLoading = false;
        }
    }
</script>

<Navbar />

<section class="relative overflow-hidden bg-slate-950/5 py-20 dark:bg-slate-950">
    <div class="mx-auto max-w-6xl px-6">
        <div class="mb-10 rounded-[32px] border border-white/10 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-10">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight">{data.competition?.name || 'Competition'}</h1>
                    <p class="text-muted-foreground">{data.competition?.description}</p>
                </div>
            </div>
        </div>

        {#if data.error}
            <div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
                <p class="font-medium">{data.error}</p>
            </div>
        {/if}

        <Tabs.Root value="teams" class="w-full flex-col justify-start gap-6 bg-zinc-900/10 p-4 rounded-lg">
            <Tabs.List class="w-fit">
                <Tabs.Trigger value="teams">Teams</Tabs.Trigger>
                <Tabs.Trigger value="matches">Matches</Tabs.Trigger>
                <Tabs.Trigger value="rankings">Rankings</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="teams" class="relative flex flex-col gap-4">
                <h2 class="text-xl font-semibold text-slate-100 mb-3">Teams</h2>

                {#if data.teams.length === 0}
                    <div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-6 text-center">
                        <p class="text-slate-300 mb-4">No teams registered for this competition.</p>
                    </div>
                {:else}
                    <div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
                                    <Table.Head class="font-semibold text-zinc-100">Team #</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Team Name</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">School</Table.Head>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {#each data.teams as team (team.id)}
                                    <Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                        <Table.Cell class="font-mono font-medium text-cyan-400">{team.teamNumber}</Table.Cell>
                                        <Table.Cell class="font-medium text-zinc-100">{team.name}</Table.Cell>
                                        <Table.Cell class="text-zinc-400">{team.school}</Table.Cell>
                                    </Table.Row>
                                {/each}
                            </Table.Body>
                        </Table.Root>
                    </div>
                {/if}
            </Tabs.Content>

            <Tabs.Content value="rankings" class="relative flex flex-col gap-4">
                <h2 class="text-xl font-semibold text-slate-100 mb-3">Rankings</h2>

                {#if rankingsLoading}
                    <div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-6 text-center">
                        <p class="text-slate-300">Loading rankings…</p>
                    </div>
                {:else}
                    {#if rankings.length === 0}
                        <div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-6 text-center">
                            <p class="text-slate-300 mb-4">No rankings available yet.</p>
                        </div>
                    {:else}
                        <div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
                                        <Table.Head class="font-semibold text-zinc-100">Rank</Table.Head>
                                        <Table.Head class="font-semibold text-zinc-100">Team #</Table.Head>
                                        <Table.Head class="font-semibold text-zinc-100">Team Name</Table.Head>
                                        <Table.Head class="font-semibold text-zinc-100">Matches</Table.Head>
                                        <Table.Head class="font-semibold text-zinc-100">Score</Table.Head>
                                        <Table.Head class="font-semibold text-zinc-100">Highest</Table.Head>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {#each rankings as r}
                                        <Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                            <Table.Cell class="font-mono font-medium text-cyan-400">{r.rank}</Table.Cell>
                                            <Table.Cell class="font-mono font-medium text-cyan-400">{r.teamNumber}</Table.Cell>
                                            <Table.Cell class="font-medium text-zinc-100">{r.teamName}</Table.Cell>
                                            <Table.Cell class="text-zinc-400">{r.matchesPlayed}</Table.Cell>
                                            <Table.Cell class="text-zinc-400">{r.rankingScore}</Table.Cell>
                                            <Table.Cell class="text-zinc-400">{r.highestMatchScore}</Table.Cell>
                                        </Table.Row>
                                    {/each}
                                </Table.Body>
                            </Table.Root>
                        </div>
                    {/if}
                {/if}
            </Tabs.Content>

            <Tabs.Content value="matches" class="relative flex flex-col gap-4">
                <h2 class="text-xl font-semibold text-slate-100 mb-3">Matches</h2>

                {#if finishedMatches.length > 0}
                    <div class="space-y-2">
                        <h3 class="text-lg font-semibold text-slate-100">Results</h3>
                        <div class="grid gap-4 md:grid-cols-2">
                            {#each finishedMatches as match}
                                <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/80">
                                    <div class="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <span class="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{match.phase.toUpperCase()}-{String(match.matchNumber).padStart(2,'0')}</span>
                                        <div class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">{getFieldName(match.fieldId) || 'N/A'}</div>
                                    </div>
                                    <p class="mb-4 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{match.endTime ? new Date(match.endTime).toLocaleString() : 'N/A'}</p>

                                    <div class="grid gap-3 sm:grid-cols-[1fr_auto_1fr] items-center">
                                        <div class={`rounded-3xl p-4 transition hover:shadow-lg hover:shadow-red-500/50 ${getMatchWinner(match.id) === 'red' ? 'border-2 border-red-500 bg-red-50 dark:bg-red-500/10' : 'bg-slate-50 dark:bg-slate-950/70'}`}>
                                            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Red alliance</p>
                                            <div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
                                                <div>{getTeamName(match.redTeamIds[0])}</div>
                                                <div>{getTeamName(match.redTeamIds[1])}</div>
                                            </div>
                                        </div>

                                        <div class="flex flex-col items-center justify-center gap-2 rounded-3xl bg-slate-900 px-4 py-6 text-white dark:bg-white/10 dark:text-white">
                                            <p class="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-300">Final</p>
                                            <p class="text-xl font-black">{getScoreDisplay(match.id)}</p>
                                            <p class={`text-xs font-semibold ${getMatchWinner(match.id) === 'red' ? 'text-red-400' : getMatchWinner(match.id) === 'blue' ? 'text-sky-400' : 'text-slate-400'}`}>
                                                {getMatchWinner(match.id) === 'red' ? 'Red ✓' : getMatchWinner(match.id) === 'blue' ? 'Blue ✓' : 'Draw'}
                                            </p>
                                        </div>

                                        <div class={`rounded-3xl p-4 transition hover:shadow-lg hover:shadow-sky-500/50 ${getMatchWinner(match.id) === 'blue' ? 'border-2 border-sky-500 bg-blue-50 dark:bg-blue-500/10' : 'bg-slate-50 dark:bg-slate-950/70'}`}>
                                            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Blue alliance</p>
                                            <div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
                                                <div>{getTeamName(match.blueTeamIds[0])}</div>
                                                <div>{getTeamName(match.blueTeamIds[1])}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mt-4 flex items-center gap-2">
                                        <button onclick={() => openDetails(match)} class="w-full rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600">Details</button>
                                    </div>
                                </article>
                            {/each}
                        </div>
                    </div>
                {/if}

                {#if unplayedMatches.length > 0}
                    <div class="space-y-2">
                        <h3 class="text-lg font-semibold text-slate-100">Upcoming Matches</h3>
                        <div class="grid gap-4 md:grid-cols-2">
                            {#each unplayedMatches as match}
                                <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/80">
                                    <div class="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <span class="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{match.phase.toUpperCase()}-{String(match.matchNumber).padStart(2,'0')}</span>
                                        <div class="flex flex-wrap items-center gap-2">
                                            <span>{getFieldName(match.fieldId) || 'TBD'}</span>
                                            <span>·</span>
                                            <span>{match.scheduledTime ? new Date(match.scheduledTime).toLocaleString() : 'TBD'}</span>
                                        </div>
                                    </div>
                                    <div class="grid gap-3 sm:grid-cols-2">
                                        <div class="rounded-3xl bg-slate-50 p-4 transition hover:shadow-lg hover:shadow-red-500/50 dark:bg-slate-950/70">
                                            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Red alliance</p>
                                            <div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
                                                {#each match.redTeamIds as teamId}
                                                    <div class="block text-left">{getTeamName(teamId)}</div>
                                                {/each}
                                            </div>
                                        </div>

                                        <div class="rounded-3xl bg-slate-50 p-4 transition hover:shadow-lg hover:shadow-sky-500/50 dark:bg-slate-950/70">
                                            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Blue alliance</p>
                                            <div class="mt-3 space-y-1 text-sm font-semibold text-slate-900 dark:text-white">
                                                {#each match.blueTeamIds as teamId}
                                                    <div class="block text-left">{getTeamName(teamId)}</div>
                                                {/each}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            {/each}
                        </div>
                    </div>
                {/if}

                {#if data.matches.length === 0}
                    <div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-12 text-center">
                        <p class="text-slate-300 mb-4">No matches yet.</p>
                    </div>
                {/if}
            </Tabs.Content>
        </Tabs.Root>
    </div>
</section>

{#if selectedMatchId && selectedMatchDetails}
    {#if selectedMatchDetails}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div class="glass-card max-h-screen w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85 dark:shadow-black/20 sm:p-8">
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">Match Details</p>
                    <h2 class="mt-2 text-2xl font-black text-slate-900 dark:text-white">{selectedMatchDetails.match.phase.toUpperCase()}-{String(selectedMatchDetails.match.matchNumber).padStart(2,'0')}</h2>
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

            <div class="space-y-4">
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div>
                            <h3 class="mb-3 text-sm font-semibold text-red-600 dark:text-red-400">Red Alliance</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Tele Independent:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{selectedMatchDetails.score?.red.teleIndependent ?? 'N/A'}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Shared:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{selectedMatchDetails.score?.red.sharedScore ?? 'N/A'}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Penalties:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">-{selectedMatchDetails.score?.red.penalties ?? 'N/A'}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Endgame:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{selectedMatchDetails.score?.red.endgame ?? 'N/A'}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Endgame Mult:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">×{selectedMatchDetails.score?.red.endgameMultiplier ?? 'N/A'}</span>
                                </div>
                                <div class="border-t border-slate-200 pt-2 dark:border-white/10">
                                    <div class="flex justify-between">
                                        <span class="font-semibold text-red-600 dark:text-red-400">Total:</span>
                                        <span class="text-lg font-black text-red-600 dark:text-red-400">{selectedMatchDetails.score?.red.total ?? 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="mb-3 text-sm font-semibold text-sky-600 dark:text-sky-400">Blue Alliance</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Tele Independent:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{selectedMatchDetails.score?.blue.teleIndependent ?? 'N/A'}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Shared:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{selectedMatchDetails.score?.blue.sharedScore ?? 'N/A'}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Penalties:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">-{selectedMatchDetails.score?.blue.penalties ?? 'N/A'}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Endgame:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{selectedMatchDetails.score?.blue.endgame ?? 'N/A'}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Endgame Mult:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">×{selectedMatchDetails.score?.blue.endgameMultiplier ?? 'N/A'}</span>
                                </div>
                                <div class="border-t border-slate-200 pt-2 dark:border-white/10">
                                    <div class="flex justify-between">
                                        <span class="font-semibold text-sky-600 dark:text-sky-400">Total:</span>
                                        <span class="text-lg font-black text-sky-600 dark:text-sky-400">{selectedMatchDetails.score?.blue.total ?? 'N/A'}</span>
                                    </div>
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

<Footer />
