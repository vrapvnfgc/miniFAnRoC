<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isCreateSheetOpen = $state(false);
	let isEditSheetOpen = $state(false);
	let showDeleteConfirm = $state(false);
	let deleteCompetitionId = $state<string | null>(null);
	let deleteCompetitionName = $state('');
	let editingCompetition = $state<any>(null);

	// Form fields for create/edit
	let formName = $state('');
	let formDescription = $state('');
	let formStatus = $state<'upcoming' | 'active' | 'completed'>('upcoming');
	let formStartDate = $state('');
	let formEndDate = $state('');

	function openCreateSheet() {
		formName = '';
		formDescription = '';
		formStatus = 'upcoming';
		formStartDate = '';
		formEndDate = '';
		isCreateSheetOpen = true;
	}

	function openEditSheet(competition: any) {
		editingCompetition = competition;
		formName = competition.name;
		formDescription = competition.description || '';
		formStatus = competition.status;
		formStartDate = competition.startDate ? new Date(competition.startDate).toISOString().slice(0, 16) : '';
		formEndDate = competition.endDate ? new Date(competition.endDate).toISOString().slice(0, 16) : '';
		isEditSheetOpen = true;
	}

	function closeSheets() {
		isCreateSheetOpen = false;
		isEditSheetOpen = false;
	}

	function openDeleteConfirm(competition: any) {
		deleteCompetitionId = competition.id;
		deleteCompetitionName = competition.name;
		showDeleteConfirm = true;
	}

	function closeDeleteConfirm() {
		showDeleteConfirm = false;
		deleteCompetitionId = null;
		deleteCompetitionName = '';
	}

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

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Competitions</h1>
			<p class="text-muted-foreground">Manage competitions and tournaments.</p>
		</div>
		<Button onclick={openCreateSheet} size="lg">+ Add Competition</Button>
	</div>

	{#if data.error}
		<div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
			<p class="font-medium">{data.error}</p>
		</div>
	{/if}

	{#if data.competitions.length === 0}
		<div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-12 text-center">
			<p class="text-slate-300 mb-4">No competitions yet. Create your first competition to get started.</p>
			<Button onclick={openCreateSheet} class="bg-cyan-600 hover:bg-cyan-700 text-white">Create Competition</Button>
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
						<Table.Head class="text-right font-semibold text-zinc-100">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.competitions as competition (competition.id)}
						<Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
							<Table.Cell class="font-medium text-zinc-100">{competition.name}</Table.Cell>
							<Table.Cell class="text-zinc-400 max-w-xs truncate">{competition.description || '—'}</Table.Cell>
							<Table.Cell>
								<span class={`inline-block px-2 py-1 rounded border text-xs font-medium ${getStatusColor(competition.status)}`}>
									{competition.status}
								</span>
							</Table.Cell>
							<Table.Cell class="text-zinc-400 text-sm">{formatDateTime(competition.startDate)}</Table.Cell>
							<Table.Cell class="text-zinc-400 text-sm">{formatDateTime(competition.endDate)}</Table.Cell>
							<Table.Cell class="text-right">
								<div class="flex gap-2 justify-end">
									<Button
										variant="outline"
										size="sm"
										onclick={() => openEditSheet(competition)}
										class="border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
									>
										Edit
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onclick={() => openDeleteConfirm(competition)}
										class="bg-red-600 hover:bg-red-700 text-white"
									>
										Delete
									</Button>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}

	<!-- Delete Confirmation Alert -->
	{#if showDeleteConfirm}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<Alert.Root class="w-96">
				<div class="flex flex-col gap-4">
					<div>
						<h2 class="text-lg font-semibold">Delete Competition</h2>
						<p class="text-sm text-muted-foreground">Are you sure you want to delete <strong>{deleteCompetitionName}</strong>? This action cannot be undone.</p>
					</div>
					<div class="flex gap-2 justify-end">
						<Button variant="outline" onclick={closeDeleteConfirm}>Cancel</Button>
						<form
							method="POST"
							action="?/delete"
							use:enhance={() => {
								return async ({ result }) => {
									if (result.type === 'success') {
										closeDeleteConfirm();
										await invalidateAll();
									}
								};
							}}
							class="inline"
						>
							<input type="hidden" name="id" value={deleteCompetitionId} />
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
				<Sheet.Title>Create New Competition</Sheet.Title>
				<Sheet.Description>
					Add a new competition to your system. Fill in all required fields.
				</Sheet.Description>
			</Sheet.Header>

			<form method="POST" action="?/create" use:enhance onsubmit={() => closeSheets()} class="space-y-4 py-4">
				<div class="grid gap-2">
					<Label for="name">Competition Name *</Label>
					<Input
						id="name"
						name="name"
						placeholder="e.g., FTC Championship 2026"
						bind:value={formName}
						required
					/>
				</div>

				<div class="grid gap-2">
					<Label for="description">Description</Label>
					<Input
						id="description"
						name="description"
						placeholder="e.g., State championship tournament"
						bind:value={formDescription}
					/>
				</div>

				<div class="grid gap-2">
					<Label for="status">Status *</Label>
					<select
						id="status"
						name="status"
						bind:value={formStatus}
						class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
						required
					>
						<option value="upcoming">Upcoming</option>
						<option value="active">Active</option>
						<option value="completed">Completed</option>
					</select>
				</div>

				<div class="grid gap-2">
					<Label for="startDate">Start Date</Label>
					<Input
						id="startDate"
						name="startDate"
						type="datetime-local"
						bind:value={formStartDate}
					/>
				</div>

				<div class="grid gap-2">
					<Label for="endDate">End Date</Label>
					<Input
						id="endDate"
						name="endDate"
						type="datetime-local"
						bind:value={formEndDate}
					/>
				</div>

				<div class="flex gap-2">
					<Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
					<Button type="submit" class="flex-1">Create Competition</Button>
				</div>
			</form>
		</Sheet.Content>
	</Sheet.Root>

	<!-- Edit Sheet -->
	<Sheet.Root open={isEditSheetOpen} onOpenChange={(open) => isEditSheetOpen = open}>
		<Sheet.Content class="w-[400px] sm:w-[540px]">
			<Sheet.Header>
				<Sheet.Title>Edit Competition</Sheet.Title>
				<Sheet.Description>
					Update the competition information.
				</Sheet.Description>
			</Sheet.Header>

			{#if editingCompetition}
				<form method="POST" action="?/edit" use:enhance onsubmit={() => closeSheets()} class="space-y-4 py-4">
					<input type="hidden" name="id" value={editingCompetition.id} />

					<div class="grid gap-2">
						<Label for="editName">Competition Name *</Label>
						<Input
							id="editName"
							name="name"
							placeholder="e.g., FTC Championship 2026"
							bind:value={formName}
							required
						/>
					</div>

					<div class="grid gap-2">
						<Label for="editDescription">Description</Label>
						<Input
							id="editDescription"
							name="description"
							placeholder="e.g., State championship tournament"
							bind:value={formDescription}
						/>
					</div>

					<div class="grid gap-2">
						<Label for="editStatus">Status *</Label>
						<select
							id="editStatus"
							name="status"
							bind:value={formStatus}
							class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
							required
						>
							<option value="upcoming">Upcoming</option>
							<option value="active">Active</option>
							<option value="completed">Completed</option>
						</select>
					</div>

					<div class="grid gap-2">
						<Label for="editStartDate">Start Date</Label>
						<Input
							id="editStartDate"
							name="startDate"
							type="datetime-local"
							bind:value={formStartDate}
						/>
					</div>

					<div class="grid gap-2">
						<Label for="editEndDate">End Date</Label>
						<Input
							id="editEndDate"
							name="endDate"
							type="datetime-local"
							bind:value={formEndDate}
						/>
					</div>

					<div class="flex gap-2">
						<Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
						<Button type="submit" class="flex-1">Update Competition</Button>
					</div>
				</form>
			{/if}
		</Sheet.Content>
	</Sheet.Root>
</div>
