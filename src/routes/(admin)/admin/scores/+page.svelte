<script lang="ts">
    import * as Table from '$lib/components/ui/table/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Label } from '$lib/components/ui/label/index.js';
    import * as Sheet from '$lib/components/ui/sheet/index.js';
    import * as Alert from '$lib/components/ui/alert/index.js';
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let isEditScoreSheetOpen = $state(false);
    let showFinalizeConfirm = $state(false);
    let finalizeMatchId = $state<string | null>(null);
    let finalizeMatchNumber = $state<number | null>(null);
    let editingScore = $state<any>(null);

    // Score form state
    let matchId = $state('');
    let matchNumber = $state<number>(0);
    let redTeleIndependent = $state(0);
    let sharedScore = $state(0);
    let redPenalties = $state(0);
    let redEndgame = $state(0);
    let redBalanceMultiplier = $state(1);

    let blueTeleIndependent = $state(0);
    let bluePenalties = $state(0);
    let blueEndgame = $state(0);
    let blueBalanceMultiplier = $state(1);
    let status = $state('submitted');

    function openEditScoreSheet(score: any, match: any) {
        editingScore = score;
        matchId = score.matchId;
        matchNumber = match?.matchNumber || 0;
        
        redTeleIndependent = score.red?.teleIndependent || 0;
        sharedScore = score.red?.sharedScore || score.blue?.sharedScore || 0;
        redPenalties = score.red?.penalties || 0;
        redEndgame = score.red?.endgame || 0;
        redBalanceMultiplier = score.red?.balanceMultiplier || 1;

        blueTeleIndependent = score.blue?.teleIndependent || 0;
        bluePenalties = score.blue?.penalties || 0;
        blueEndgame = score.blue?.endgame || 0;
        blueBalanceMultiplier = score.blue?.balanceMultiplier || 1;
        
        status = score.status;

        isEditScoreSheetOpen = true;
    }

    function closeSheets() {
        isEditScoreSheetOpen = false;
        editingScore = null;
    }

    function openFinalizeConfirm(score: any, match: any) {
        finalizeMatchId = score.matchId;
        finalizeMatchNumber = match?.matchNumber || 0;
        showFinalizeConfirm = true;
    }

    function closeFinalizeConfirm() {
        showFinalizeConfirm = false;
        finalizeMatchId = null;
        finalizeMatchNumber = null;
    }

    function getTeamName(teamId: string): string {
        const team = data.teams.find((t: any) => t.id === teamId);
        return team ? `${team.teamNumber} - ${team.name}` : 'Unknown Team';
    }

    function getMatch(matchId: string): any {
        return data.matches.find((m: any) => m.id === matchId);
    }
</script>

<div class="flex flex-col gap-6 p-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Scores</h1>
            <p class="text-muted-foreground">Manage and finalize match scores.</p>
        </div>
    </div>

    {#if data.error}
        <div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
            <p class="font-medium">{data.error}</p>
        </div>
    {/if}

    {#if data.scores.length === 0}
        <div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-12 text-center">
            <p class="text-slate-300">No scores recorded yet. Scores appear here after a match is played.</p>
        </div>
    {:else}
        <div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
            <Table.Root>
                <Table.Header>
                    <Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
                        <Table.Head class="font-semibold text-zinc-100">Match #</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100">Phase</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100">Red Alliance</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100">Score</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100">Blue Alliance</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100">Status</Table.Head>
                        <Table.Head class="text-right font-semibold text-zinc-100">Actions</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each data.scores.sort((a: any, b: any) => {
                        const matchA = getMatch(a.matchId);
                        const matchB = getMatch(b.matchId);
                        if (!matchA || !matchB) return 0;
                        return matchA.matchNumber - matchB.matchNumber;
                    }) as score (score.id)}
                        {@const match = getMatch(score.matchId)}
                        {#if match}
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
                                    <div class="flex items-center gap-2 text-lg">
                                        <span class="text-red-400">{score.red?.total || 0}</span>
                                        <span class="text-slate-400">-</span>
                                        <span class="text-blue-400">{score.blue?.total || 0}</span>
                                    </div>
                                </Table.Cell>
                                <Table.Cell class="text-slate-100">
                                    <div class="space-y-1">
                                        <div>{getTeamName(match.blueTeamIds[0])}</div>
                                        <div>{getTeamName(match.blueTeamIds[1])}</div>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold {score.status === 'finalized' ? 'bg-green-600/30 text-green-400' : 'bg-yellow-600/30 text-yellow-400'}">
                                        {score.status}
                                    </span>
                                </Table.Cell>
                                <Table.Cell class="text-right">
                                    <div class="flex gap-2 justify-end">
                                        {#if score.status !== 'finalized'}
                                            <Button onclick={() => openFinalizeConfirm(score, match)} size="sm" class="bg-green-600 hover:bg-green-700 text-white">Finalize</Button>
                                        {/if}
                                        <Button onclick={() => openEditScoreSheet(score, match)} size="sm" variant="outline" class="border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">Edit</Button>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        {/if}
                    {/each}
                </Table.Body>
            </Table.Root>
        </div>
    {/if}

    <!-- Finalize Confirmation Alert -->
    {#if showFinalizeConfirm}
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Alert.Root class="w-96">
                <div class="flex flex-col gap-4 p-4">
                    <div>
                        <h2 class="text-lg font-semibold">Finalize Score</h2>
                        <p class="text-sm text-muted-foreground">Are you sure you want to finalize Match {finalizeMatchNumber}? Finalized scores update the rankings.</p>
                    </div>
                    <div class="flex gap-2 justify-end">
                        <Button variant="outline" onclick={closeFinalizeConfirm}>Cancel</Button>
                        <form method="POST" action="?/finalize" use:enhance={() => {
                            return async ({ result }) => {
                                if (result.type === 'success') {
                                    closeFinalizeConfirm();
                                    await invalidateAll();
                                }
                            };
                        }} class="inline">
                            <input type="hidden" name="matchId" value={finalizeMatchId} />
                            <Button class="bg-green-600 hover:bg-green-700 text-white" type="submit">Finalize</Button>
                        </form>
                    </div>
                </div>
            </Alert.Root>
        </div>
    {/if}

    <!-- Edit Score Sheet -->
    <Sheet.Root open={isEditScoreSheetOpen} onOpenChange={(open) => isEditScoreSheetOpen = open}>
        <Sheet.Content class="w-[400px] sm:w-[540px] max-h-screen overflow-y-auto">
            <Sheet.Header>
                <Sheet.Title>Edit Score - Match {matchNumber}</Sheet.Title>
                <Sheet.Description>Update match scores. Changes will recalculate totals.</Sheet.Description>
            </Sheet.Header>

            {#if editingScore}
                <form method="POST" action="?/editScore" use:enhance={() => {
                    return async ({ result }) => {
                        if (result.type === 'success') {
                            closeSheets();
                            await invalidateAll();
                        }
                    };
                }} class="space-y-6 py-4">
                    <input type="hidden" name="matchId" value={matchId} />

                    <div class="grid gap-2">
                        <Label for="status">Score Status</Label>
                        <select id="status" name="status" bind:value={status} class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100">
                            <option value="draft">Draft</option>
                            <option value="submitted">Submitted</option>
                            <option value="finalized">Finalized</option>
                        </select>
                    </div>

                    <div class="space-y-4 rounded-lg border border-red-900/50 bg-red-950/20 p-4">
                        <h3 class="font-semibold text-red-400">Red Alliance</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="grid gap-2">
                                <Label for="redTeleIndependent">Teleop Independent</Label>
                                <Input id="redTeleIndependent" name="redTeleIndependent" type="number" bind:value={redTeleIndependent} />
                            </div>
                            <div class="grid gap-2">
                                <Label for="redPenalties">Penalties</Label>
                                <Input id="redPenalties" name="redPenalties" type="number" bind:value={redPenalties} />
                            </div>
                            <div class="grid gap-2">
                                <Label for="redEndgame">Endgame</Label>
                                <Input id="redEndgame" name="redEndgame" type="number" bind:value={redEndgame} />
                            </div>
                            <div class="grid gap-2">
                                <Label for="redBalanceMultiplier">Multiplier</Label>
                                <Input id="redBalanceMultiplier" name="redBalanceMultiplier" type="number" step="0.1" bind:value={redBalanceMultiplier} />
                            </div>
                        </div>
                    </div>

                    <div class="grid gap-2 rounded-lg border border-purple-900/50 bg-purple-950/20 p-4">
                        <Label for="sharedScore">Shared Score (Both Alliances)</Label>
                        <Input id="sharedScore" name="sharedScore" type="number" bind:value={sharedScore} />
                    </div>

                    <div class="space-y-4 rounded-lg border border-blue-900/50 bg-blue-950/20 p-4">
                        <h3 class="font-semibold text-blue-400">Blue Alliance</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="grid gap-2">
                                <Label for="blueTeleIndependent">Teleop Independent</Label>
                                <Input id="blueTeleIndependent" name="blueTeleIndependent" type="number" bind:value={blueTeleIndependent} />
                            </div>
                            <div class="grid gap-2">
                                <Label for="bluePenalties">Penalties</Label>
                                <Input id="bluePenalties" name="bluePenalties" type="number" bind:value={bluePenalties} />
                            </div>
                            <div class="grid gap-2">
                                <Label for="blueEndgame">Endgame</Label>
                                <Input id="blueEndgame" name="blueEndgame" type="number" bind:value={blueEndgame} />
                            </div>
                            <div class="grid gap-2">
                                <Label for="blueBalanceMultiplier">Multiplier</Label>
                                <Input id="blueBalanceMultiplier" name="blueBalanceMultiplier" type="number" step="0.1" bind:value={blueBalanceMultiplier} />
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
                        <Button type="submit" class="flex-1 bg-cyan-600 hover:bg-cyan-700">Save Score</Button>
                    </div>
                </form>
            {/if}
        </Sheet.Content>
    </Sheet.Root>
</div>
