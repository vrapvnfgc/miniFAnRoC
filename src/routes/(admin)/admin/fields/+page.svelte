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

    let isCreateSheetOpen = $state(false);
    let isEditSheetOpen = $state(false);
    let showDeleteConfirm = $state(false);
    let deleteFieldId = $state<string | null>(null);
    let deleteFieldName = $state('');
    let editingField = $state<any>(null);

    // Form fields
    let formName = $state('');
    let formDescription = $state('');
    let formStatus = $state('ACTIVE');

    function openCreateSheet() {
        formName = '';
        formDescription = '';
        formStatus = 'ACTIVE';
        isCreateSheetOpen = true;
    }

    function openEditSheet(field: any) {
        editingField = field;
        formName = field.name || '';
        formDescription = field.description || '';
        formStatus = field.status || 'ACTIVE';
        isEditSheetOpen = true;
    }

    function closeSheets() {
        isCreateSheetOpen = false;
        isEditSheetOpen = false;
        editingField = null;
    }

    function openDeleteConfirm(field: any) {
        deleteFieldId = field.id;
        deleteFieldName = field.name;
        showDeleteConfirm = true;
    }

    function closeDeleteConfirm() {
        showDeleteConfirm = false;
        deleteFieldId = null;
        deleteFieldName = '';
    }
</script>

<div class="flex flex-col gap-6 p-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Fields</h1>
            <p class="text-muted-foreground">Manage your fields (locations) here.</p>
        </div>
        <Button onclick={openCreateSheet} size="lg">+ Add Field</Button>
    </div>

    {#if data.error}
        <div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
            <p class="font-medium">{data.error}</p>
        </div>
    {/if}

    {#if data.fields.length === 0}
        <div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-12 text-center">
            <p class="text-slate-300 mb-4">No fields yet. Create your first field to get started.</p>
            <Button onclick={openCreateSheet} class="bg-cyan-600 hover:bg-cyan-700 text-white">Create Field</Button>
        </div>
    {:else}
        <div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
            <Table.Root>
                <Table.Header>
                    <Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
                        <Table.Head class="font-semibold text-zinc-100">Name</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100">Description</Table.Head>
                        <Table.Head class="font-semibold text-zinc-100">Status</Table.Head>
                        <Table.Head class="text-right font-semibold text-zinc-100">Actions</Table.Head>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {#each data.fields as field (field.id)}
                        <Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                            <Table.Cell class="font-medium text-zinc-100">{field.name}</Table.Cell>
                            <Table.Cell class="text-zinc-400">{field.description || '—'}</Table.Cell>
                            <Table.Cell class="text-zinc-300">{field.status}</Table.Cell>
                            <Table.Cell class="text-right">
                                <div class="flex gap-2 justify-end">
                                    <Button variant="outline" size="sm" onclick={() => openEditSheet(field)} class="border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">Edit</Button>
                                    <Button variant="destructive" size="sm" onclick={() => openDeleteConfirm(field)} class="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </div>
    {/if}

    {#if showDeleteConfirm}
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Alert.Root class="w-96">
                <div class="flex flex-col gap-4 p-4">
                    <div>
                        <h2 class="text-lg font-semibold">Delete Field</h2>
                        <p class="text-sm text-muted-foreground">Are you sure you want to delete <strong>{deleteFieldName}</strong>? This action cannot be undone.</p>
                    </div>
                    <div class="flex gap-2 justify-end">
                        <Button variant="outline" onclick={closeDeleteConfirm}>Cancel</Button>
                        <form method="POST" action="?/delete" use:enhance={() => {
                            return async ({ result }) => {
                                if (result.type === 'success') {
                                    closeDeleteConfirm();
                                    await invalidateAll();
                                }
                            };
                        }} class="inline">
                            <input type="hidden" name="id" value={deleteFieldId} />
                            <Button variant="destructive" type="submit">Delete</Button>
                        </form>
                    </div>
                </div>
            </Alert.Root>
        </div>
    {/if}

    <!-- Create Sheet -->
    <Sheet.Root open={isCreateSheetOpen} onOpenChange={(open) => isCreateSheetOpen = open}>
        <Sheet.Content class="w-[400px] sm:w-[540px]">
            <Sheet.Header>
                <Sheet.Title>Create Field</Sheet.Title>
                <Sheet.Description>Add a new location/field for matches.</Sheet.Description>
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
                    <Label for="name">Name *</Label>
                    <Input id="name" name="name" placeholder="e.g., Field A" bind:value={formName} required />
                </div>

                <div class="grid gap-2">
                    <Label for="description">Description</Label>
                    <Input id="description" name="description" bind:value={formDescription} />
                </div>

                <div class="grid gap-2">
                    <Label for="status">Status</Label>
                    <select id="status" name="status" bind:value={formStatus} class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100">
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </select>
                </div>

                <div class="flex gap-2">
                    <Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
                    <Button type="submit" class="flex-1">Create Field</Button>
                </div>
            </form>
        </Sheet.Content>
    </Sheet.Root>

    <!-- Edit Sheet -->
    <Sheet.Root open={isEditSheetOpen} onOpenChange={(open) => isEditSheetOpen = open}>
        <Sheet.Content class="w-[400px] sm:w-[540px]">
            <Sheet.Header>
                <Sheet.Title>Edit Field</Sheet.Title>
                <Sheet.Description>Update field details.</Sheet.Description>
            </Sheet.Header>

            {#if editingField}
                <form method="POST" action="?/update" use:enhance={() => {
                    return async ({ result }) => {
                        if (result.type === 'success') {
                            closeSheets();
                            await invalidateAll();
                        }
                    };
                }} class="space-y-4 py-4">
                    <input type="hidden" name="id" value={editingField.id} />

                    <div class="grid gap-2">
                        <Label for="editName">Name *</Label>
                        <Input id="editName" name="name" bind:value={formName} required />
                    </div>

                    <div class="grid gap-2">
                        <Label for="editDescription">Description</Label>
                        <Input id="editDescription" name="description" bind:value={formDescription} />
                    </div>

                    <div class="grid gap-2">
                        <Label for="editStatus">Status</Label>
                        <select id="editStatus" name="status" bind:value={formStatus} class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100">
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                    </div>

                    <div class="flex gap-2">
                        <Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
                        <Button type="submit" class="flex-1">Update Field</Button>
                    </div>
                </form>
            {/if}
        </Sheet.Content>
    </Sheet.Root>
</div>
