<script lang="ts">
    import * as Table from '$lib/components/ui/table/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let selectedLog = $state<any>(null);
    let isDetailsOpen = $state(false);

    function viewDetails(log: any) {
        selectedLog = log;
        isDetailsOpen = true;
    }

    function getUserName(userId: string | undefined): string {
        if (!userId) return 'System / Guest';
        const user = data.users.find((u: any) => u.id === userId);
        return user ? `${user.firstName} ${user.lastName}` : userId;
    }

    function getActionColor(action: string): string {
        switch (action) {
            case 'CREATE':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'UPDATE':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'DELETE':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'LOGIN':
                return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            case 'LOGOUT':
                return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30';
            default:
                return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        }
    }

    function formatDateTime(date: string | Date): string {
        const d = new Date(date);
        return d.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
</script>

<div class="flex flex-col gap-6 p-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Audit Logs</h1>
            <p class="text-muted-foreground">View system activity and changes.</p>
        </div>
    </div>

    {#if data.error}
        <div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
            <p class="font-medium">{data.error}</p>
        </div>
    {/if}

    {#if data.logs.length === 0}
        <div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-12 text-center">
            <p class="text-slate-300">No audit logs found.</p>
        </div>
    {:else}
        <div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
            <Table.Root>
                <Table.Header>
                    <Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
                        <Table.Head class="font-semibold text-zinc-100">Date & Time</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100">Action</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100">Resource</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100">Actor</Table.Head>
                        <Table.Head class="text-right font-semibold text-zinc-100">Details</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each data.logs as log (log.id)}
                        <Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                            <Table.Cell class="text-zinc-300 text-sm">{formatDateTime(log.createdAt)}</Table.Cell>
                            <Table.Cell>
                                <span class={`inline-block px-2 py-1 rounded border text-xs font-medium ${getActionColor(log.action)}`}>
                                    {log.action}
                                </span>
                            </Table.Cell>
                            <Table.Cell class="font-medium text-zinc-100">
                                {log.resource}
                                {#if log.resourceId}
                                    <span class="text-zinc-500 text-xs ml-1 font-mono">{log.resourceId}</span>
                                {/if}
                            </Table.Cell>
                            <Table.Cell class="text-zinc-400">
                                {getUserName(log.actorId)}
                            </Table.Cell>
                            <Table.Cell class="text-right">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onclick={() => viewDetails(log)}
                                    class="border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                                >
                                    View Details
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </div>
    {/if}

    <!-- Details Dialog -->
    <Dialog.Root open={isDetailsOpen} onOpenChange={(open) => isDetailsOpen = open}>
        <Dialog.Content class="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <Dialog.Header>
                <Dialog.Title>Audit Log Details</Dialog.Title>
                <Dialog.Description>
                    Detailed information about the recorded action.
                </Dialog.Description>
            </Dialog.Header>
            
            {#if selectedLog}
                <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <span class="font-medium text-zinc-400 text-right">Action</span>
                        <div class="col-span-3">
                            <span class={`inline-block px-2 py-1 rounded border text-xs font-medium ${getActionColor(selectedLog.action)}`}>
                                {selectedLog.action}
                            </span>
                        </div>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <span class="font-medium text-zinc-400 text-right">Time</span>
                        <span class="col-span-3 text-zinc-100">{formatDateTime(selectedLog.createdAt)}</span>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <span class="font-medium text-zinc-400 text-right">Actor</span>
                        <span class="col-span-3 text-zinc-100">{getUserName(selectedLog.actorId)}</span>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <span class="font-medium text-zinc-400 text-right">Resource</span>
                        <div class="col-span-3 text-zinc-100">
                            {selectedLog.resource}
                            {#if selectedLog.resourceId}
                                <span class="text-zinc-500 text-sm ml-2">ID: {selectedLog.resourceId}</span>
                            {/if}
                        </div>
                    </div>
                    {#if selectedLog.ipAddress}
                        <div class="grid grid-cols-4 items-center gap-4">
                            <span class="font-medium text-zinc-400 text-right">IP Address</span>
                            <span class="col-span-3 text-zinc-100 font-mono text-sm">{selectedLog.ipAddress}</span>
                        </div>
                    {/if}
                    {#if selectedLog.userAgent}
                        <div class="grid grid-cols-4 items-center gap-4">
                            <span class="font-medium text-zinc-400 text-right">User Agent</span>
                            <span class="col-span-3 text-zinc-400 text-sm break-all">{selectedLog.userAgent}</span>
                        </div>
                    {/if}
                    {#if selectedLog.details && Object.keys(selectedLog.details).length > 0}
                        <div class="flex flex-col gap-2 mt-2">
                            <span class="font-medium text-zinc-400">Additional Details:</span>
                            <pre class="bg-zinc-950 border border-zinc-800 rounded-md p-4 text-xs text-zinc-300 overflow-x-auto"><code>{JSON.stringify(selectedLog.details, null, 2)}</code></pre>
                        </div>
                    {/if}
                </div>
            {/if}
            <div class="flex justify-end">
                <Button variant="outline" onclick={() => isDetailsOpen = false}>Close</Button>
            </div>
        </Dialog.Content>
    </Dialog.Root>
</div>
