<script lang="ts">
    import * as Table from '$lib/components/ui/table/index.js';
    import { Switch } from '$lib/components/ui/switch/index.js';
    import { Label } from '$lib/components/ui/label/index.js';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    function toggleUnfinalized(checked: boolean) {
        const url = new URL($page.url);
        if (checked) {
            url.searchParams.set('includeUnfinalized', 'true');
        } else {
            url.searchParams.delete('includeUnfinalized');
        }
        goto(url, { keepFocus: true, noScroll: true });
    }
</script>

<div class="flex flex-col gap-6 p-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Rankings</h1>
            <p class="text-muted-foreground">View tournament standings and team performance.</p>
        </div>
        <div class="flex items-center space-x-2">
            <Switch 
                id="unfinalized" 
                checked={data.includeUnfinalized} 
                onCheckedChange={toggleUnfinalized}
            />
            <Label for="unfinalized">Include Unfinalized Matches</Label>
        </div>
    </div>

    {#if data.error}
        <div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
            <p class="font-medium">{data.error}</p>
        </div>
    {/if}

    {#if data.rankings.length === 0}
        <div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-12 text-center">
            <p class="text-slate-300">No rankings available yet. Matches need to be played and scored.</p>
        </div>
    {:else}
        <div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
            <Table.Root>
                <Table.Header>
                    <Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
                        <Table.Head class="font-semibold text-zinc-100 text-center w-16">Rank</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100">Team</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100 text-right">Ranking Score (RS)</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100 text-right">Highest Score</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100 text-right">Matches Played</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each data.rankings as rank}
                        <Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                            <Table.Cell class="font-mono font-bold text-center text-cyan-400 text-lg">
                                {rank.rank}
                            </Table.Cell>
                            <Table.Cell>
                                <div class="font-medium text-zinc-100">{rank.teamNumber} - {rank.teamName}</div>
                                {#if rank.reason}
                                    <div class="text-xs text-zinc-500 mt-1">{rank.reason}</div>
                                {/if}
                            </Table.Cell>
                            <Table.Cell class="font-semibold text-right text-green-400">
                                {rank.rankingScore.toFixed(2)}
                            </Table.Cell>
                            <Table.Cell class="text-right text-zinc-300">
                                {rank.highestMatchScore}
                            </Table.Cell>
                            <Table.Cell class="text-right text-zinc-300">
                                {rank.matchesPlayed}
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </div>
    {/if}
</div>
