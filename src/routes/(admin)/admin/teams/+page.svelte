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
	let deleteTeamId = $state<string | null>(null);
	let deleteTeamName = $state('');
	let editingTeam = $state<any>(null);

	// Form fields for create/edit
	let formTeamNumber = $state('');
	let formName = $state('');
	let formSchool = $state('');
	let formCoach = $state('');
	let formRobotName = $state('');

	function openCreateSheet() {
		formTeamNumber = '';
		formName = '';
		formSchool = '';
		formCoach = '';
		formRobotName = '';
		isCreateSheetOpen = true;
	}

	function openEditSheet(team: any) {
		editingTeam = team;
		formTeamNumber = team.teamNumber;
		formName = team.name;
		formSchool = team.school;
		formCoach = team.coach || '';
		formRobotName = team.robotName || '';
		isEditSheetOpen = true;
	}

	function closeSheets() {
		isCreateSheetOpen = false;
		isEditSheetOpen = false;
	}

	function openDeleteConfirm(team: any) {
		deleteTeamId = team.id;
		deleteTeamName = team.name;
		showDeleteConfirm = true;
	}

	function closeDeleteConfirm() {
		showDeleteConfirm = false;
		deleteTeamId = null;
		deleteTeamName = '';
	}
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Teams</h1>
			<p class="text-muted-foreground">Manage your teams here.</p>
		</div>
		<Button onclick={openCreateSheet} size="lg">+ Add Team</Button>
	</div>

	{#if data.error}
		<div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
			<p class="font-medium">{data.error}</p>
		</div>
	{/if}

	{#if data.teams.length === 0}
		<div class="rounded-lg border border-dashed border-slate-600 bg-slate-900/50 p-12 text-center">
			<p class="text-slate-300 mb-4">No teams yet. Create your first team to get started.</p>
			<Button onclick={openCreateSheet} class="bg-cyan-600 hover:bg-cyan-700 text-white">Create Team</Button>
		</div>
	{:else}
		<div class="overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-lg">
			<Table.Root>
				<Table.Header>
					<Table.Row class="border-b border-slate-700 bg-slate-800 hover:bg-slate-800">
						<Table.Head class="font-semibold text-slate-100">Team #</Table.Head>
						<Table.Head class="font-semibold text-slate-100">Team Name</Table.Head>
						<Table.Head class="font-semibold text-slate-100">School</Table.Head>
						<Table.Head class="font-semibold text-slate-100">Coach</Table.Head>
						<Table.Head class="font-semibold text-slate-100">Robot Name</Table.Head>
						<Table.Head class="text-right font-semibold text-slate-100">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.teams as team (team.id)}
						<Table.Row class="border-b border-slate-700 hover:bg-slate-800 transition-colors">
							<Table.Cell class="font-mono font-medium text-cyan-400">{team.teamNumber}</Table.Cell>
							<Table.Cell class="font-medium text-slate-100">{team.name}</Table.Cell>
							<Table.Cell class="text-slate-300">{team.school}</Table.Cell>
							<Table.Cell class="text-slate-400">{team.coach || '—'}</Table.Cell>
							<Table.Cell class="text-slate-400">{team.robotName || '—'}</Table.Cell>
							<Table.Cell class="text-right">
								<div class="flex gap-2 justify-end">
									<Button 
										variant="outline" 
										size="sm" 
										onclick={() => openEditSheet(team)}
										class="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
									>
										Edit
									</Button>
									<Button 
										variant="destructive" 
										size="sm"
										onclick={() => openDeleteConfirm(team)}
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
						<h2 class="text-lg font-semibold">Delete Team</h2>
						<p class="text-sm text-muted-foreground">Are you sure you want to delete <strong>{deleteTeamName}</strong>? This action cannot be undone.</p>
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
							<input type="hidden" name="id" value={deleteTeamId} />
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
				<Sheet.Title>Create New Team</Sheet.Title>
				<Sheet.Description>
					Add a new team to your system. Fill in all required fields.
				</Sheet.Description>
			</Sheet.Header>

			<form method="POST" action="?/create" use:enhance onsubmit={() => closeSheets()} class="space-y-4 py-4">
				<div class="grid gap-2">
					<Label for="teamNumber">Team Number *</Label>
					<Input 
						id="teamNumber" 
						name="teamNumber" 
						placeholder="e.g., 101"
						bind:value={formTeamNumber}
						required 
					/>
				</div>

				<div class="grid gap-2">
					<Label for="name">Team Name *</Label>
					<Input 
						id="name" 
						name="name" 
						placeholder="e.g., Team Volt"
						bind:value={formName}
						required 
					/>
				</div>

				<div class="grid gap-2">
					<Label for="school">School *</Label>
					<Input 
						id="school" 
						name="school" 
						placeholder="e.g., Lincoln High School"
						bind:value={formSchool}
						required 
					/>
				</div>

				<div class="grid gap-2">
					<Label for="coach">Coach Name</Label>
					<Input 
						id="coach" 
						name="coach" 
						placeholder="e.g., John Doe"
						bind:value={formCoach}
					/>
				</div>

				<div class="grid gap-2">
					<Label for="robotName">Robot Name</Label>
					<Input 
						id="robotName" 
						name="robotName" 
						placeholder="e.g., Thunderbot"
						bind:value={formRobotName}
					/>
				</div>

				<div class="flex gap-2">
					<Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
					<Button type="submit" class="flex-1">Create Team</Button>
				</div>
			</form>
		</Sheet.Content>
	</Sheet.Root>

	<!-- Edit Sheet -->
	<Sheet.Root open={isEditSheetOpen} onOpenChange={(open) => isEditSheetOpen = open}>
		<Sheet.Content class="w-[400px] sm:w-[540px]">
			<Sheet.Header>
				<Sheet.Title>Edit Team</Sheet.Title>
				<Sheet.Description>
					Update the team information.
				</Sheet.Description>
			</Sheet.Header>

			{#if editingTeam}
				<form method="POST" action="?/update" use:enhance onsubmit={() => closeSheets()} class="space-y-4 py-4">
					<input type="hidden" name="id" value={editingTeam.id} />

					<div class="grid gap-2">
						<Label for="editTeamNumber">Team Number *</Label>
						<Input 
							id="editTeamNumber" 
							name="teamNumber" 
							placeholder="e.g., 101"
							bind:value={formTeamNumber}
							required 
						/>
					</div>

					<div class="grid gap-2">
						<Label for="editName">Team Name *</Label>
						<Input 
							id="editName" 
							name="name" 
							placeholder="e.g., Team Volt"
							bind:value={formName}
							required 
						/>
					</div>

					<div class="grid gap-2">
						<Label for="editSchool">School *</Label>
						<Input 
							id="editSchool" 
							name="school" 
							placeholder="e.g., Lincoln High School"
							bind:value={formSchool}
							required 
						/>
					</div>

					<div class="grid gap-2">
						<Label for="editCoach">Coach Name</Label>
						<Input 
							id="editCoach" 
							name="coach" 
							placeholder="e.g., John Doe"
							bind:value={formCoach}
						/>
					</div>

					<div class="grid gap-2">
						<Label for="editRobotName">Robot Name</Label>
						<Input 
							id="editRobotName" 
							name="robotName" 
							placeholder="e.g., Thunderbot"
							bind:value={formRobotName}
						/>
					</div>

					<div class="flex gap-2">
						<Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
						<Button type="submit" class="flex-1">Update Team</Button>
					</div>
				</form>
			{/if}
		</Sheet.Content>
	</Sheet.Root>
</div>
