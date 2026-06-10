<script lang="ts">
    import * as Table from '$lib/components/ui/table/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Label } from '$lib/components/ui/label/index.js';
    import * as Sheet from '$lib/components/ui/sheet/index.js';
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import { api } from '$lib/api';
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import * as Tabs from '$lib/components/ui/tabs/index.js';

    let { data }: { data: PageData } = $props();

    let isRegisterOpen = $state(false);
    let isCreateMatchOpen = $state(false);
    let isDeleteOpen = $state(false);
    let isUnregisterOpen = $state(false);

    // Register form state
    let registerTeamId = $state('');
    let unregisterTeamId = $state('');
    let unregisterTeamName = $state('');

    // Match form state
    let formMatchNumber = $state('');
    let formPhase = $state('qualification');
    let formFieldId = $state('');
    let formRedTeam1 = $state('');
    let formRedTeam2 = $state('');
    let formBlueTeam1 = $state('');
    let formBlueTeam2 = $state('');
    let formScheduledTime = $state('');
    let formNotes = $state('');
    let editingMatch: any = $state(null);
    let deleteMatchId = $state('');
    let deleteMatchNumber = $state('');

    let matchScores = $state<Record<string, { redScore: number; blueScore: number }>>({});
    let isScoreSheetOpen = $state(false);
    let isEditFinishedMatchOpen = $state(false);
    let editingFinishedMatch: any = $state(null);
    let scoringMatch: any = $state(null);

    // Score form state
    let redTeleIndependent = $state(0);
    let sharedScore = $state(0);
    let redPenalties = $state(0);
    let redEndgame = $state(0);
    let redBalanceMultiplier = $state(1);

    let blueTeleIndependent = $state(0);

    let bluePenalties = $state(0);
    let blueEndgame = $state(0);
    let blueBalanceMultiplier = $state(1);

    function openRegister() {
        registerTeamId = '';
        isRegisterOpen = true;
    }

    function openUnregister(team: any) {
        unregisterTeamId = team.id;
        unregisterTeamName = `${team.teamNumber} - ${team.name}`;
        isUnregisterOpen = true;
    }

    function openCreateMatch() {
        formMatchNumber = '';
        formPhase = 'qualification';
        formFieldId = '';
        formRedTeam1 = '';
        formRedTeam2 = '';
        formBlueTeam1 = '';
        formBlueTeam2 = '';
        formScheduledTime = '';
        formNotes = '';
        editingMatch = null;
        isCreateMatchOpen = true;
    }

    function openEditMatch(match: any) {
        editingMatch = match;
        formMatchNumber = match.matchNumber?.toString() ?? '';
        formPhase = match.phase ?? 'qualification';
        formFieldId = match.fieldId ?? '';
        formRedTeam1 = match.redTeamIds?.[0] ?? '';
        formRedTeam2 = match.redTeamIds?.[1] ?? '';
        formBlueTeam1 = match.blueTeamIds?.[0] ?? '';
        formBlueTeam2 = match.blueTeamIds?.[1] ?? '';
        formScheduledTime = match.scheduledTime ? new Date(match.scheduledTime).toISOString().slice(0, 16) : '';
        formNotes = match.notes ?? '';
        isCreateMatchOpen = true;
    }

    async function openEditFinishedMatchSheet(match: any) {
        editingFinishedMatch = match;
        formMatchNumber = match.matchNumber?.toString() ?? '';
        formPhase = match.phase ?? 'qualification';
        formFieldId = match.fieldId ?? '';
        formRedTeam1 = match.redTeamIds?.[0] ?? '';
        formRedTeam2 = match.redTeamIds?.[1] ?? '';
        formBlueTeam1 = match.blueTeamIds?.[0] ?? '';
        formBlueTeam2 = match.blueTeamIds?.[1] ?? '';
        formScheduledTime = match.scheduledTime ? new Date(match.scheduledTime).toISOString().slice(0, 16) : '';
        formNotes = match.notes ?? '';

        // Load the score for this match
        try {
            const scoreRes = await api.scores.getByMatchId(match.id);
            if (scoreRes.data?.score) {
                redTeleIndependent = scoreRes.data.score.red.teleIndependent || 0;
                sharedScore = scoreRes.data.score.red.sharedScore || scoreRes.data.score.blue.sharedScore || 0;
                redPenalties = scoreRes.data.score.red.penalties || 0;

                redEndgame = scoreRes.data.score.red.endgame || 0;
                redBalanceMultiplier = scoreRes.data.score.red.balanceMultiplier || 1;

                blueTeleIndependent = scoreRes.data.score.blue.teleIndependent || 0;

                bluePenalties = scoreRes.data.score.blue.penalties || 0;

                blueEndgame = scoreRes.data.score.blue.endgame || 0;
                blueBalanceMultiplier = scoreRes.data.score.blue.balanceMultiplier || 1;
            }
        } catch (err) {
            console.error('Failed to load score:', err);
        }

        isEditFinishedMatchOpen = true;
    }

    function openScoreSheet(match: any) {
        scoringMatch = match;
        redTeleIndependent = 0;
        sharedScore = 0;
        redPenalties = 0;
        redEndgame = 0;
        redBalanceMultiplier = 1;
        blueTeleIndependent = 0;

        bluePenalties = 0;
        blueEndgame = 0;
        blueBalanceMultiplier = 1;
        isScoreSheetOpen = true;
    }

    function openDeleteMatch(match: any) {
        deleteMatchId = match.id;
        deleteMatchNumber = match.matchNumber;
        isDeleteOpen = true;
    }

    function closeSheets() {
        isRegisterOpen = false;
        isCreateMatchOpen = false;
        isDeleteOpen = false;
        isUnregisterOpen = false;
        editingMatch = null;
        editingFinishedMatch = null;
        scoringMatch = null;
        isScoreSheetOpen = false;
        isEditFinishedMatchOpen = false;
    }

    function getTeamName(teamId: string) {
        const all = [...(data.teams || []), ...(data.availableTeams || [])];
        const team = all.find((t: any) => t.id === teamId);
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

    onMount(async () => {
        await loadScores();
    });
</script>

<div class="flex flex-col gap-6 p-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">{data.competition?.name || 'Competition'}</h1>
            <p class="text-muted-foreground">{data.competition?.description}</p>
        </div>
        <div class="flex gap-2">
            <Button onclick={openRegister}>Register Team</Button>
            <Button onclick={openCreateMatch} size="lg">+ Add Match</Button>
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
        </Tabs.List>

        <Tabs.Content value="teams" class="relative flex flex-col gap-4">
            <h2 class="text-xl font-semibold text-slate-100 mb-3">Teams</h2>

            {#if data.teams.length === 0}
                <div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-6 text-center">
                    <p class="text-slate-300 mb-4">No teams registered for this competition.</p>
                    <Button onclick={openRegister}>Register a Team</Button>
                </div>
            {:else}
                <div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
                    <Table.Root>
                            <Table.Header>
                                <Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
                                    <Table.Head class="font-semibold text-zinc-100">Team #</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Team Name</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">School</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100 text-right pr-4" aria-hidden="true"></Table.Head>
                                </Table.Row>
                            </Table.Header>
                        <Table.Body>
                            {#each data.teams as team (team.id)}
                                <Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                    <Table.Cell class="font-mono font-medium text-cyan-400">{team.teamNumber}</Table.Cell>
                                    <Table.Cell class="font-medium text-zinc-100">{team.name}</Table.Cell>
                                    <Table.Cell class="text-zinc-400">{team.school}</Table.Cell>
                                    <Table.Cell class="text-right pr-4">
                                        <Button onclick={() => openUnregister(team)} size="sm" variant="destructive" class="px-3 py-1 text-sm">Unregister</Button>
                                    </Table.Cell>
                                </Table.Row>
                            {/each}
                        </Table.Body>
                    </Table.Root>
                </div>
            {/if}
        </Tabs.Content>

        <Tabs.Content value="matches" class="relative flex flex-col gap-4">
            <h2 class="text-xl font-semibold text-slate-100 mb-3">Matches</h2>

            {#if finishedMatches.length > 0}
                <div class="space-y-2">
                    <h3 class="text-lg font-semibold text-slate-100">Results</h3>
                    <div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
                                    <Table.Head class="font-semibold text-zinc-100">Match #</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Phase</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Red Alliance</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Score</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Blue Alliance</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Location</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Actions</Table.Head>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {#each finishedMatches as match (match.id)}
                                    <Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                        <Table.Cell class="font-mono font-medium text-cyan-400">{match.matchNumber}</Table.Cell>
                                        <Table.Cell class="text-slate-300 capitalize">{match.phase}</Table.Cell>
                                        <Table.Cell class="text-slate-100">
                                            <div class="space-y-1">
                                                <div>{getTeamName(match.redTeamIds[0])}</div>
                                                <div>{getTeamName(match.redTeamIds[1])}</div>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell class="font-semibold">
                                            <div class="flex items-center gap-2">
                                                <span class="text-red-400">{matchScores[match.id]?.redScore || 0}</span>
                                                <span class="text-slate-400">-</span>
                                                <span class="text-blue-400">{matchScores[match.id]?.blueScore || 0}</span>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell class="text-slate-100">
                                            <div class="space-y-1">
                                                <div>{getTeamName(match.blueTeamIds[0])}</div>
                                                <div>{getTeamName(match.blueTeamIds[1])}</div>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell class="text-slate-300">{getFieldName(match.fieldId)}</Table.Cell>
                                        <Table.Cell>
                                            <div class="flex gap-2">
                                                    <Button onclick={() => openEditFinishedMatchSheet(match)} size="sm" variant="outline" class="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border-blue-600/50">Edit</Button>
                                                    <Button onclick={() => openDeleteMatch(match)} size="sm" variant="destructive" class="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                                                </div>
                                        </Table.Cell>
                                    </Table.Row>
                                {/each}
                            </Table.Body>
                        </Table.Root>
                    </div>
                </div>
            {/if}

            {#if unplayedMatches.length > 0}
                <div class="space-y-2">
                    <h3 class="text-lg font-semibold text-slate-100">Upcoming Matches</h3>
                    <div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
                                    <Table.Head class="font-semibold text-zinc-100">Match #</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Phase</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Red Alliance</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Blue Alliance</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Status</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Scheduled Time</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Location</Table.Head>
                                    <Table.Head class="font-semibold text-zinc-100">Actions</Table.Head>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {#each unplayedMatches as match (match.id)}
                                    <Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                        <Table.Cell class="font-mono font-medium text-cyan-400">{match.matchNumber}</Table.Cell>
                                        <Table.Cell class="text-slate-300 capitalize">{match.phase}</Table.Cell>
                                        <Table.Cell class="text-slate-100">
                                            <div class="space-y-1">
                                                <div>{getTeamName(match.redTeamIds[0])}</div>
                                                <div>{getTeamName(match.redTeamIds[1])}</div>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell class="text-slate-100">
                                            <div class="space-y-1">
                                                <div>{getTeamName(match.blueTeamIds[0])}</div>
                                                <div>{getTeamName(match.blueTeamIds[1])}</div>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold {match.status === 'scheduled' ? 'bg-yellow-600/30 text-yellow-300' : 'bg-slate-700 text-slate-300'}">
                                                {match.status}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell class="text-slate-300">{match.scheduledTime ? new Date(match.scheduledTime).toLocaleString() : '—'}</Table.Cell>
                                        <Table.Cell class="text-slate-300">{getFieldName(match.fieldId)}</Table.Cell>
                                        <Table.Cell>
                                            <div class="flex gap-2">
                                                <Button onclick={() => openScoreSheet(match)} size="sm" class="bg-green-600/20 text-green-400 hover:bg-green-600/40 border border-green-600/50">Record Score</Button>
                                                <Button onclick={() => openEditMatch(match)} size="sm" variant="outline" class="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border-blue-600/50">Edit</Button>
                                                <Button onclick={() => openDeleteMatch(match)} size="sm" variant="destructive" class="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                {/each}
                            </Table.Body>
                        </Table.Root>
                    </div>
                </div>
            {/if}

            {#if data.matches.length === 0}
                <div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-12 text-center">
                    <p class="text-slate-300 mb-4">No matches yet. Create your first match to get started.</p>
                    <Button onclick={openCreateMatch} class="bg-cyan-600 hover:bg-cyan-700 text-white">Create Match</Button>
                </div>
            {/if}
        </Tabs.Content>
    </Tabs.Root>

    <!-- Register Team Sheet -->
    <Sheet.Root open={isRegisterOpen} onOpenChange={(open) => isRegisterOpen = open}>
        <Sheet.Content class="w-[360px] sm:w-[480px]">
            <Sheet.Header>
                <Sheet.Title>Register Team</Sheet.Title>
                <Sheet.Description>Select an existing team to register for this competition.</Sheet.Description>
            </Sheet.Header>

            <form method="POST" action="?/register" use:enhance={() => {
                return async ({ result }) => {
                    if (result.type === 'success') {
                        closeSheets();
                        await invalidateAll();
                        await loadScores();
                    }
                };
            }} class="space-y-4 py-4">
                <div class="grid gap-2">
                    <Label for="team">Team *</Label>
                    <select id="team" name="teamId" bind:value={registerTeamId} class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100" required>
                        <option value="">Select a team</option>
                        {#each data.availableTeams as team}
                            <option value={team.id}>{team.teamNumber} - {team.name}</option>
                        {/each}
                    </select>
                </div>

                <div class="flex gap-2">
                    <Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
                    <Button type="submit" class="flex-1">Register Team</Button>
                </div>
            </form>
        </Sheet.Content>
    </Sheet.Root>

    <!-- Unregister Team Sheet -->
    <Sheet.Root open={isUnregisterOpen} onOpenChange={(open) => isUnregisterOpen = open}>
        <Sheet.Content class="w-[360px] sm:w-[480px]">
            <Sheet.Header>
                <Sheet.Title>Unregister Team</Sheet.Title>
                <Sheet.Description>Remove {unregisterTeamName} from this competition.</Sheet.Description>
            </Sheet.Header>

            <form method="POST" action="?/unregister" use:enhance={() => {
                return async ({ result }) => {
                    if (result.type === 'success') {
                        closeSheets();
                        await invalidateAll();
                        await loadScores();
                    }
                };
            }} class="space-y-4 py-4">
                <input type="hidden" name="teamId" value={unregisterTeamId} />

                <div class="flex gap-2">
                    <Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
                    <Button type="submit" variant="destructive" class="flex-1">Unregister Team</Button>
                </div>
            </form>
        </Sheet.Content>
    </Sheet.Root>

    <!-- Create Match Sheet -->
    <Sheet.Root open={isCreateMatchOpen} onOpenChange={(open) => isCreateMatchOpen = open}>
        <Sheet.Content class="w-[400px] sm:w-[640px]">
            <Sheet.Header>
                <Sheet.Title>{editingMatch ? 'Edit Match' : 'Create Match'}</Sheet.Title>
                <Sheet.Description>{editingMatch ? 'Edit the match and save changes.' : 'Schedule a new match for this competition.'}</Sheet.Description>
            </Sheet.Header>

            <form method="POST" action={editingMatch ? '?/edit' : '?/create'} use:enhance={() => {
                return async ({ result }) => {
                    if (result.type === 'success') {
                        closeSheets();
                        await invalidateAll();
                        await loadScores();
                    }
                };
            }} class="space-y-4 py-4">
                {#if editingMatch}
                    <input type="hidden" name="matchId" value={editingMatch.id} />
                {/if}
                <div class="grid gap-2">
                    <Label for="matchNumber">Match Number *</Label>
                    <Input id="matchNumber" name="matchNumber" placeholder="e.g., 1" bind:value={formMatchNumber} required />
                </div>

                <div class="grid gap-2">
                    <Label for="phase">Phase *</Label>
                    <select id="phase" name="phase" bind:value={formPhase} class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100" required>
                        <option value="qualification">Qualification</option>
                        <option value="playoff">Playoff</option>
                    </select>
                </div>

                <div class="grid gap-2">
                    <Label for="fieldId">Field *</Label>
                    <select id="fieldId" name="fieldId" bind:value={formFieldId} class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100" required>
                        <option value="">Select a field</option>
                        {#each data.fields as field}
                            <option value={field.id}>{field.name}</option>
                        {/each}
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <Label for="redTeam1">Red Team 1 *</Label>
                        <select id="redTeam1" name="redTeam1" bind:value={formRedTeam1} class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100" required>
                            <option value="">Select team</option>
                            {#each data.teams as team}
                                <option value={team.id}>{team.teamNumber} - {team.name}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <Label for="redTeam2">Red Team 2 *</Label>
                        <select id="redTeam2" name="redTeam2" bind:value={formRedTeam2} class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100" required>
                            <option value="">Select team</option>
                            {#each data.teams as team}
                                <option value={team.id}>{team.teamNumber} - {team.name}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <Label for="blueTeam1">Blue Team 1 *</Label>
                        <select id="blueTeam1" name="blueTeam1" bind:value={formBlueTeam1} class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100" required>
                            <option value="">Select team</option>
                            {#each data.teams as team}
                                <option value={team.id}>{team.teamNumber} - {team.name}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <Label for="blueTeam2">Blue Team 2 *</Label>
                        <select id="blueTeam2" name="blueTeam2" bind:value={formBlueTeam2} class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100" required>
                            <option value="">Select team</option>
                            {#each data.teams as team}
                                <option value={team.id}>{team.teamNumber} - {team.name}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="grid gap-2">
                    <Label for="scheduledTime">Scheduled Time</Label>
                    <Input id="scheduledTime" name="scheduledTime" type="datetime-local" bind:value={formScheduledTime} />
                </div>

                <div class="grid gap-2">
                    <Label for="notes">Notes</Label>
                    <Input id="notes" name="notes" bind:value={formNotes} />
                </div>

                <div class="flex gap-2">
                    <Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
                    <Button type="submit" class="flex-1">{editingMatch ? 'Save Changes' : 'Create Match'}</Button>
                </div>
            </form>
        </Sheet.Content>
    </Sheet.Root>
    <!-- Score Sheet -->
    <Sheet.Root open={isScoreSheetOpen} onOpenChange={(open) => isScoreSheetOpen = open}>
        <Sheet.Content class="w-[400px] sm:w-[540px] max-h-screen overflow-y-auto">
            <Sheet.Header>
                <Sheet.Title>Record Match Score</Sheet.Title>
                <Sheet.Description>
                    Enter the final scores for Match {scoringMatch?.matchNumber || ''} to finish the match.
                </Sheet.Description>
            </Sheet.Header>

            {#if scoringMatch}
                <form 
                    method="POST" 
                    action="?/finishMatch" 
                    use:enhance={() => {
                        return async ({ result }) => {
                            if (result.type === 'success') {
                                closeSheets();
                                await invalidateAll();
                                await loadScores();
                            }
                        };
                    }} class="space-y-6 py-4">
                    <input type="hidden" name="matchId" value={scoringMatch.id} />

                    <!-- Red Alliance -->
                    <div class="space-y-4 rounded-lg border border-red-700 bg-red-900/20 p-4">
                        <h3 class="font-semibold text-red-400">Red Alliance</h3>
                        
                        <div class="grid gap-3">
                            <div class="grid gap-2">
                                <Label for="redTeleIndependent" class="text-sm">Tele Independent Score</Label>
                                <Input 
                                    id="redTeleIndependent" 
                                    name="redTeleIndependent" 
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    bind:value={redTeleIndependent}
                                    class="bg-slate-700"
                                    required 
                                />
                            </div>

                            <div class="grid gap-2">
                                <Label for="redShared" class="text-sm">Shared score chung</Label>
                                <Input 
                                    id="redShared" 
                                    name="sharedScore" 
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    bind:value={sharedScore}
                                    class="bg-slate-700"
                                    required 
                                />
                            </div>

                            <div class="grid gap-2">
                                <Label for="redPenalties" class="text-sm">Penalties</Label>
                                <Input 
                                    id="redPenalties" 
                                    name="redPenalties" 
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    bind:value={redPenalties}
                                    class="bg-slate-700"
                                    required 
                                />
                            </div>

                            <div class="grid gap-2">
                                <Label for="redEndgame" class="text-sm">Endgame Score</Label>
                                <Input 
                                    id="redEndgame" 
                                    name="redEndgame" 
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    bind:value={redEndgame}
                                    class="bg-slate-700"
                                    required 
                                />
                            </div>

                            <div class="grid gap-2">
                                <Label for="redBalanceMultiplier" class="text-sm">Balance Multiplier</Label>
                                <Input 
                                    id="redBalanceMultiplier" 
                                    name="redBalanceMultiplier" 
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    bind:value={redBalanceMultiplier}
                                    class="bg-slate-700"
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Blue Alliance -->
                    <div class="space-y-4 rounded-lg border border-blue-700 bg-blue-900/20 p-4">
                        <h3 class="font-semibold text-blue-400">Blue Alliance</h3>
                        
                        <div class="grid gap-3">
                            <div class="grid gap-2">
                                <Label for="blueTeleIndependent" class="text-sm">Tele Independent Score</Label>
                                <Input 
                                    id="blueTeleIndependent" 
                                    name="blueTeleIndependent" 
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    bind:value={blueTeleIndependent}
                                    class="bg-slate-700"
                                    required 
                                />
                            </div>

                            <div class="grid gap-2">
                                <Label for="blueShared" class="text-sm">Shared score chung</Label>
                                <Input 
                                    id="blueShared" 
                                    name="sharedScore" 
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    bind:value={sharedScore}
                                    class="bg-slate-700"
                                    required 
                                />
                            </div>

                            <div class="grid gap-2">
                                <Label for="bluePenalties" class="text-sm">Penalties</Label>
                                <Input 
                                    id="bluePenalties" 
                                    name="bluePenalties" 
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    bind:value={bluePenalties}
                                    class="bg-slate-700"
                                    required 
                                />
                            </div>

                            <div class="grid gap-2">
                                <Label for="blueEndgame" class="text-sm">Endgame Score</Label>
                                <Input 
                                    id="blueEndgame" 
                                    name="blueEndgame" 
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    bind:value={blueEndgame}
                                    class="bg-slate-700"
                                    required 
                                />
                            </div>

                            <div class="grid gap-2">
                                <Label for="blueBalanceMultiplier" class="text-sm">Balance Multiplier</Label>
                                <Input 
                                    id="blueBalanceMultiplier" 
                                    name="blueBalanceMultiplier" 
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    bind:value={blueBalanceMultiplier}
                                    class="bg-slate-700"
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
                        <Button type="submit" class="flex-1 bg-green-600 hover:bg-green-700">Finish Match & Record Score</Button>
                    </div>
                </form>
            {/if}
        </Sheet.Content>
    </Sheet.Root>

    <!-- Edit Finished Match Sheet -->
    <Sheet.Root open={isEditFinishedMatchOpen} onOpenChange={(open) => isEditFinishedMatchOpen = open}>
        <Sheet.Content class="w-[400px] sm:w-[540px] max-h-screen overflow-y-auto">
            <Sheet.Header>
                <Sheet.Title>Edit Finished Match</Sheet.Title>
                <Sheet.Description>
                    Update match details and/or edit the recorded score.
                </Sheet.Description>
            </Sheet.Header>

            {#if editingFinishedMatch}
                <form 
                    method="POST" 
                    action="?/editFinished" 
                    use:enhance={() => {
                        return async ({ result }) => {
                            if (result.type === 'success') {
                                closeSheets();
                                await invalidateAll();
                                await loadScores();
                            }
                        };
                    }} class="space-y-4 py-4">
                    <input type="hidden" name="matchId" value={editingFinishedMatch.id} />

                    <!-- Match Details Section -->
                    <div class="space-y-3 rounded-lg border border-zinc-700 bg-zinc-800/50 p-3">
                        <h3 class="font-semibold text-zinc-100">Match Details</h3>
                        
                        <div class="grid gap-2">
                            <Label for="editFinMatchNumber">Match Number *</Label>
                            <Input 
                                id="editFinMatchNumber" 
                                name="matchNumber" 
                                type="number"
                                placeholder="e.g., 1"
                                bind:value={formMatchNumber}
                                required 
                            />
                        </div>

                        <div class="grid gap-2">
                            <Label for="editFinPhase">Phase *</Label>
                            <select 
                                id="editFinPhase" 
                                name="phase" 
                                bind:value={formPhase}
                                class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            >
                                <option value="qualification">Qualification</option>
                                <option value="playoff">Playoff</option>
                            </select>
                        </div>

                        <div class="grid gap-2">
                            <Label for="editFinFieldId">Location *</Label>
                            <select 
                                id="editFinFieldId" 
                                name="fieldId" 
                                bind:value={formFieldId}
                                class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            >
                                <option value="">Select a location...</option>
                                {#each data.fields as field}
                                    <option value={field.id}>{field.name}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <!-- Score editing (copy fields) -->
                    <div class="space-y-4 rounded-lg border border-zinc-700 bg-zinc-800/50 p-3">
                        <h3 class="font-semibold text-zinc-100">Edit Score</h3>
                        <div class="grid gap-3">
                            <div class="grid gap-2">
                                <Label for="redTeleIndependent" class="text-sm">Red Tele Independent</Label>
                                <Input id="redTeleIndependent" name="redTeleIndependent" type="number" step="0.5" min="0" bind:value={redTeleIndependent} class="bg-slate-700" required />
                            </div>
                            <div class="grid gap-2">
                                <Label for="redShared" class="text-sm">Shared score chung</Label>
                                <Input id="redShared" name="sharedScore" type="number" step="0.5" min="0" bind:value={sharedScore} class="bg-slate-700" required />
                            </div>
                            <div class="grid gap-2">
                                <Label for="redPenalties" class="text-sm">Red Penalties</Label>
                                <Input id="redPenalties" name="redPenalties" type="number" step="0.5" min="0" bind:value={redPenalties} class="bg-slate-700" required />
                            </div>
                            <div class="grid gap-2">
                                <Label for="redEndgame" class="text-sm">Red Endgame</Label>
                                <Input id="redEndgame" name="redEndgame" type="number" step="0.5" min="0" bind:value={redEndgame} class="bg-slate-700" required />
                            </div>
                            <div class="grid gap-2">
                                <Label for="redBalanceMultiplier" class="text-sm">Balance Multiplier</Label>
                                <Input id="redBalanceMultiplier" name="redBalanceMultiplier" type="number" step="0.01" min="1" bind:value={redBalanceMultiplier} class="bg-slate-700" required />
                            </div>

                            <div class="grid gap-2">
                                <Label for="blueTeleIndependent" class="text-sm">Blue Tele Independent</Label>
                                <Input id="blueTeleIndependent" name="blueTeleIndependent" type="number" step="0.5" min="0" bind:value={blueTeleIndependent} class="bg-slate-700" required />
                            </div>
                            <div class="grid gap-2">
                                <Label for="blueShared" class="text-sm">Shared score chung</Label>
                                <Input id="blueShared" name="sharedScore" type="number" step="0.5" min="0" bind:value={sharedScore} class="bg-slate-700" required />
                            </div>
                            <div class="grid gap-2">
                                <Label for="bluePenalties" class="text-sm">Blue Penalties</Label>
                                <Input id="bluePenalties" name="bluePenalties" type="number" step="0.5" min="0" bind:value={bluePenalties} class="bg-slate-700" required />
                            </div>
                            <div class="grid gap-2">
                                <Label for="blueEndgame" class="text-sm">Blue Endgame</Label>
                                <Input id="blueEndgame" name="blueEndgame" type="number" step="0.5" min="0" bind:value={blueEndgame} class="bg-slate-700" required />
                            </div>
                            <div class="grid gap-2">
                                <Label for="blueBalanceMultiplier" class="text-sm">Balance Multiplier</Label>
                                <Input id="blueBalanceMultiplier" name="blueBalanceMultiplier" type="number" step="0.01" min="1" bind:value={blueBalanceMultiplier} class="bg-slate-700" required />
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
                        <Button type="submit" class="flex-1 bg-green-600 hover:bg-green-700">Update Match & Score</Button>
                    </div>
                </form>
            {/if}
        </Sheet.Content>
    </Sheet.Root>

    <!-- Delete Match Sheet -->
    <Sheet.Root open={isDeleteOpen} onOpenChange={(open) => isDeleteOpen = open}>
        <Sheet.Content class="w-[360px] sm:w-[480px]">
            <Sheet.Header>
                <Sheet.Title>Delete Match</Sheet.Title>
                <Sheet.Description>Confirm deletion of match #{deleteMatchNumber}.</Sheet.Description>
            </Sheet.Header>

            <form method="POST" action="?/delete" use:enhance={() => {
                return async ({ result }) => {
                    if (result.type === 'success') {
                        closeSheets();
                        await invalidateAll();
                        await loadScores();
                    }
                };
            }} class="space-y-4 py-4">
                <input type="hidden" name="matchId" value={deleteMatchId} />

                <div class="flex gap-2">
                    <Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
                    <Button type="submit" variant="destructive" class="flex-1">Delete Match</Button>
                </div>
            </form>
        </Sheet.Content>
    </Sheet.Root>
</div>
