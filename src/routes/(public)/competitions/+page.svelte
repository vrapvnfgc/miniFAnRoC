<script lang="ts">
    import * as Table from '$lib/components/ui/table/index.js';
    import Navbar from '$lib/components/layout/Navbar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    function getStatusColor(status: string): string {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'active':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'completed':
                return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
            default:
                return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30';
        }
    }

    function formatDateTime(date: string | undefined): string {
        if (!date) return '—';
        const d = new Date(date);
        return d.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
</script>

<Navbar />

<section class="relative overflow-hidden bg-slate-950/5 py-20 dark:bg-slate-950">
    <div class="mx-auto max-w-6xl px-6">
        <div class="mb-10 rounded-[32px] border border-white/10 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-10">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight">Competitions</h1>
                    <p class="text-muted-foreground">View competitions and schedules.</p>
                </div>
            </div>
        </div>

        {#if data.error}
            <div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
                <p class="font-medium">{data.error}</p>
            </div>
        {/if}

        {#if data.competitions.length === 0}
            <div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-12 text-center">
                <p class="text-slate-300 mb-4">No competitions yet.</p>
            </div>
        {:else}
            <div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
                <Table.Root>
                    <Table.Header>
                        <Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
                            <Table.Head class="font-semibold text-zinc-100">Name</Table.Head>
                            <Table.Head class="font-semibold text-zinc-100">Description</Table.Head>
                            <Table.Head class="font-semibold text-zinc-100">Status</Table.Head>
                            <Table.Head class="font-semibold text-zinc-100">Start Date</Table.Head>
                            <Table.Head class="font-semibold text-zinc-100">End Date</Table.Head>
                            <Table.Head class="text-right font-semibold text-zinc-100">View</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {#each data.competitions as competition (competition.id)}
                            <Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                <Table.Cell class="font-medium text-zinc-100">
                                    <a href={`/competitions/${competition.id}`} class="text-zinc-100 hover:underline">{competition.name}</a>
                                </Table.Cell>
                                <Table.Cell class="text-zinc-400 max-w-xs truncate">{competition.description || '—'}</Table.Cell>
                                <Table.Cell>
                                    <span class={`inline-block px-2 py-1 rounded border text-xs font-medium ${getStatusColor(competition.status)}`}>
                                        {competition.status}
                                    </span>
                                </Table.Cell>
                                <Table.Cell class="text-zinc-400 text-sm">{formatDateTime(competition.startDate)}</Table.Cell>
                                <Table.Cell class="text-zinc-400 text-sm">{formatDateTime(competition.endDate)}</Table.Cell>
                                <Table.Cell class="text-right">
                                    <a href={`/competitions/${competition.id}`} class="text-cyan-400 hover:underline">View</a>
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    </Table.Body>
                </Table.Root>
            </div>
        {/if}
    </div>
</section>

<Footer />
