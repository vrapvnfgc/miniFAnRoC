<script lang="ts">
    import * as Table from '$lib/components/ui/table/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Label } from '$lib/components/ui/label/index.js';
    import * as Sheet from '$lib/components/ui/sheet/index.js';
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let isRegisterOpen = $state(false);
    let isCreateMatchOpen = $state(false);

    // Register form state
    let registerTeamId = $state('');

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

    function openRegister() {
        registerTeamId = '';
        isRegisterOpen = true;
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
        isCreateMatchOpen = true;
    }

    function closeSheets() {
        isRegisterOpen = false;
        isCreateMatchOpen = false;
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

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
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
                                <Table.Head class="font-semibold text-zinc-100">Name</Table.Head>
                                <Table.Head class="font-semibold text-zinc-100">School</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each data.teams as team (team.id)}
                                <Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                    <Table.Cell class="font-medium text-zinc-100">{team.teamNumber}</Table.Cell>
                                    <Table.Cell class="text-zinc-400 max-w-xs truncate">
                                        <a href={`/teams/${team.id}`} class="hover:underline">{team.name}</a>
                                    </Table.Cell>
                                    <Table.Cell class="text-zinc-400">{team.school}</Table.Cell>
                                </Table.Row>
                            {/each}
                        </Table.Body>
                    </Table.Root>
                </div>
            {/if}
        </div>

        <div>
            <h2 class="text-xl font-semibold text-slate-100 mb-3">Matches</h2>

            {#if data.matches.length === 0}
                <div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-6 text-center">
                    <p class="text-slate-300 mb-4">No matches scheduled for this competition.</p>
                    <Button onclick={openCreateMatch}>Add a Match</Button>
                </div>
            {:else}
                <div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
                    <Table.Root>
                        <Table.Header>
                            <Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
                                <Table.Head class="font-semibold text-zinc-100">Match #</Table.Head>
                                <Table.Head class="font-semibold text-zinc-100">Phase</Table.Head>
                                <Table.Head class="font-semibold text-zinc-100">Field</Table.Head>
                                <Table.Head class="font-semibold text-zinc-100">Red Alliance</Table.Head>
                                <Table.Head class="font-semibold text-zinc-100">Blue Alliance</Table.Head>
                                <Table.Head class="font-semibold text-zinc-100">Scheduled</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each data.matches as match (match.id)}
                                <Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                    <Table.Cell class="font-medium text-zinc-100">{match.matchNumber}</Table.Cell>
                                    <Table.Cell class="text-zinc-400">{match.phase}</Table.Cell>
                                    <Table.Cell class="text-zinc-400">{getFieldName(match.fieldId)}</Table.Cell>
                                    <Table.Cell class="text-zinc-400">{getTeamName(match.redTeamIds[0])}, {getTeamName(match.redTeamIds[1])}</Table.Cell>
                                    <Table.Cell class="text-zinc-400">{getTeamName(match.blueTeamIds[0])}, {getTeamName(match.blueTeamIds[1])}</Table.Cell>
                                    <Table.Cell class="text-zinc-400">{match.scheduledTime ? new Date(match.scheduledTime).toLocaleString() : '—'}</Table.Cell>
                                </Table.Row>
                            {/each}
                        </Table.Body>
                    </Table.Root>
                </div>
            {/if}
        </div>
    </div>

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

    <!-- Create Match Sheet -->
    <Sheet.Root open={isCreateMatchOpen} onOpenChange={(open) => isCreateMatchOpen = open}>
        <Sheet.Content class="w-[400px] sm:w-[640px]">
            <Sheet.Header>
                <Sheet.Title>Create Match</Sheet.Title>
                <Sheet.Description>Schedule a new match for this competition.</Sheet.Description>
            </Sheet.Header>

            <form method="POST" action="?/create" use:enhance={() => {
                return async ({ result }) => {
                    if (result.type === 'success') {
                        closeSheets();
                        await invalidateAll();
                    }
                };
            }} class="space-y-4 py-4">
                <div class="grid gap-2">
                    <Label for="matchNumber">Match Number *</Label>
                    <Input id="matchNumber" name="matchNumber" placeholder="e.g., 1" bind:value={formMatchNumber} required />
                </div>

                <div class="grid gap-2">
                    <Label for="phase">Phase *</Label>
                    <select id="phase" name="phase" bind:value={formPhase} class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100" required>
                        <option value="qualification">Qualification</option>
                        <option value="semifinal">Semifinal</option>
                        <option value="final">Final</option>
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
                    <Button type="submit" class="flex-1">Create Match</Button>
                </div>
            </form>
        </Sheet.Content>
    </Sheet.Root>
</div>
