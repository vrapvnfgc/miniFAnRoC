<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDown';
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
	let formCompetitionIds = $state<string[]>([]);
	let competitionSearch = $state('');

	let formLocation = $state('');
	let formRepEmail = $state('');
	let formRepPhone = $state('');
	let formTeacherName = $state('');
	let formTeacherEmail = $state('');
	let formTeacherPhone = $state('');
	let formMembersStr = $state('');
	let formMemberDetailsStr = $state('');

	function toggleCompetition(id: string) {
		if (formCompetitionIds.includes(id)) {
			formCompetitionIds = formCompetitionIds.filter((c) => c !== id);
		} else {
			formCompetitionIds = [...formCompetitionIds, id];
		}
	}

	function selectAll() {
		formCompetitionIds = data.competitions.map((c) => c.id);
	}

	function clearAll() {
		formCompetitionIds = [];
	}

	const filteredCompetitions = $derived.by(() => {
		return (data.competitions || []).filter((c) =>
			!competitionSearch || c.name.toLowerCase().includes(competitionSearch.toLowerCase()) || c.id.includes(competitionSearch)
		);
	});

	function openCreateSheet() {
		formTeamNumber = '';
		formName = '';
		formSchool = '';
		formCoach = '';
		formRobotName = '';
		formCompetitionIds = [];
		formLocation = '';
		formRepEmail = '';
		formRepPhone = '';
		formTeacherName = '';
		formTeacherEmail = '';
		formTeacherPhone = '';
		formMembersStr = '';
		formMemberDetailsStr = '[]';
		isCreateSheetOpen = true;
	}

	function openEditSheet(team: any) {
		editingTeam = team;
		formTeamNumber = team.teamNumber;
		formName = team.name;
		formSchool = team.school;
		formCoach = team.coach || '';
		formRobotName = team.robotName || '';
		formCompetitionIds = team.competitionIds || [];
		
		formLocation = team.location || '';
		formRepEmail = team.representativeEmail || '';
		formRepPhone = team.representativePhone || '';
		formTeacherName = team.teacherName || '';
		formTeacherEmail = team.teacherEmail || '';
		formTeacherPhone = team.teacherPhone || '';
		formMembersStr = (team.members || []).join(', ');
		formMemberDetailsStr = JSON.stringify(team.memberDetails || []);
		
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

	function getCompetitionNames(ids: string[] | undefined): string {
		if (!ids || ids.length === 0) return '—';
		return ids
			.map((id) => {
				const c = data.competitions.find((comp) => comp.id === id);
				return c ? c.name : 'Unknown';
			})
			.join(', ');
	}
	
	let membersJson = $derived.by(() => {
		return JSON.stringify(formMembersStr.split(',').map(s => s.trim()).filter(Boolean));
	});
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
		<div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
			<Table.Root>
				<Table.Header>
					<Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
						<Table.Head class="font-semibold text-zinc-100">Team #</Table.Head>
						<Table.Head class="font-semibold text-zinc-100">Team Name</Table.Head>
						<Table.Head class="font-semibold text-zinc-100">School</Table.Head>
						<Table.Head class="font-semibold text-zinc-100">Coach</Table.Head>
						<Table.Head class="font-semibold text-zinc-100">Robot Name</Table.Head>
						<Table.Head class="font-semibold text-zinc-100">Competitions</Table.Head>
						<Table.Head class="text-right font-semibold text-zinc-100">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.teams as team (team.id)}
						<Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
							<Table.Cell class="font-mono font-medium text-cyan-400">{team.teamNumber}</Table.Cell>
							<Table.Cell class="font-medium text-zinc-100">{team.name}</Table.Cell>
							<Table.Cell class="text-zinc-400">{team.school}</Table.Cell>
							<Table.Cell class="text-zinc-500">{team.coach || '—'}</Table.Cell>
							<Table.Cell class="text-zinc-500">{team.robotName || '—'}</Table.Cell>
							<Table.Cell class="text-zinc-400">{getCompetitionNames(team.competitionIds)}</Table.Cell>
							<Table.Cell class="text-right">
								<div class="flex gap-2 justify-end">
									<Button 
										variant="outline" 
										size="sm" 
										onclick={() => openEditSheet(team)}
									class="border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
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
		<Sheet.Content class="w-[400px] sm:w-[540px] overflow-y-auto">
			<Sheet.Header>
				<Sheet.Title>Create New Team</Sheet.Title>
				<Sheet.Description>
					Add a new team to your system. Fill in all required fields.
				</Sheet.Description>
			</Sheet.Header>

			<form method="POST" action="?/create" use:enhance onsubmit={() => closeSheets()} class="space-y-4 py-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-2">
						<Label for="teamNumber">Team Number *</Label>
						<Input id="teamNumber" name="teamNumber" bind:value={formTeamNumber} required />
					</div>
					<div class="grid gap-2">
						<Label for="name">Team Name *</Label>
						<Input id="name" name="name" bind:value={formName} required />
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-2">
						<Label for="school">School *</Label>
						<Input id="school" name="school" bind:value={formSchool} required />
					</div>
					<div class="grid gap-2">
						<Label for="location">Location</Label>
						<Input id="location" name="location" bind:value={formLocation} />
					</div>
				</div>

				<div class="grid gap-2">
					<Label for="competitionIds">Competitions</Label>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class="w-full">
							{#snippet child({ props })}
								<button
									type="button"
									{...props}
									class="dark:bg-input/30 border-input h-8 rounded-none border bg-transparent px-2.5 py-1 text-xs text-slate-100 w-full flex items-center justify-between"
								>
									<span class="truncate">{formCompetitionIds && formCompetitionIds.length ? getCompetitionNames(formCompetitionIds) : 'Select competitions'}</span>
									<CaretDownIcon class="text-muted-foreground size-4" />
								</button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-60">
							<div class="p-2 w-60">
								<Input placeholder="Search competitions..." bind:value={competitionSearch} onclick={(e) => e.stopPropagation()} />
								<div class="mt-2 max-h-48 overflow-auto">
									{#each filteredCompetitions as comp}
										<label class="flex items-center gap-2 p-2 rounded hover:bg-slate-800 cursor-pointer" onclick={(e) => { e.stopPropagation(); toggleCompetition(comp.id); }}>
											<Checkbox checked={formCompetitionIds.includes(comp.id)} />
											<span class="text-sm text-slate-100">{comp.name}</span>
										</label>
									{/each}
									{#if filteredCompetitions.length === 0}
										<div class="p-2 text-sm text-slate-400">No competitions</div>
									{/if}
								</div>
								<div class="mt-2 flex justify-between gap-2">
									<Button variant="ghost" size="sm" type="button" onclick={(e) => { e.stopPropagation(); selectAll(); }}>Select all</Button>
									<Button variant="ghost" size="sm" type="button" onclick={(e) => { e.stopPropagation(); clearAll(); }}>Clear</Button>
								</div>
							</div>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
					{#each formCompetitionIds as id}
						<input type="hidden" name="competitionIds" value={id} />
					{/each}
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-2">
						<Label for="coach">Coach Name</Label>
						<Input id="coach" name="coach" bind:value={formCoach} />
					</div>
					<div class="grid gap-2">
						<Label for="robotName">Robot Name</Label>
						<Input id="robotName" name="robotName" bind:value={formRobotName} />
					</div>
				</div>

				<fieldset class="border rounded-md p-4 space-y-4">
					<legend class="text-sm font-medium px-2 text-muted-foreground">Representatives</legend>
					<div class="grid grid-cols-2 gap-4">
						<div class="grid gap-2">
							<Label for="representativeEmail">Rep Email</Label>
							<Input id="representativeEmail" type="email" name="representativeEmail" bind:value={formRepEmail} />
						</div>
						<div class="grid gap-2">
							<Label for="representativePhone">Rep Phone</Label>
							<Input id="representativePhone" name="representativePhone" bind:value={formRepPhone} />
						</div>
					</div>
				</fieldset>
				
				<fieldset class="border rounded-md p-4 space-y-4">
					<legend class="text-sm font-medium px-2 text-muted-foreground">Teachers</legend>
					<div class="grid grid-cols-3 gap-2">
						<div class="grid gap-2">
							<Label for="teacherName">Name</Label>
							<Input id="teacherName" name="teacherName" bind:value={formTeacherName} />
						</div>
						<div class="grid gap-2">
							<Label for="teacherEmail">Email</Label>
							<Input id="teacherEmail" type="email" name="teacherEmail" bind:value={formTeacherEmail} />
						</div>
						<div class="grid gap-2">
							<Label for="teacherPhone">Phone</Label>
							<Input id="teacherPhone" name="teacherPhone" bind:value={formTeacherPhone} />
						</div>
					</div>
				</fieldset>

				<div class="grid gap-2">
					<Label for="members">Members (comma separated)</Label>
					<Input id="members" bind:value={formMembersStr} />
					<input type="hidden" name="members" value={membersJson} />
				</div>
				
				<div class="grid gap-2">
					<Label for="memberDetails">Member Details (JSON)</Label>
					<Textarea id="memberDetails" name="memberDetails" bind:value={formMemberDetailsStr} />
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
		<Sheet.Content class="w-[400px] sm:w-[540px] overflow-y-auto">
			<Sheet.Header>
				<Sheet.Title>Edit Team</Sheet.Title>
				<Sheet.Description>
					Update the team information.
				</Sheet.Description>
			</Sheet.Header>

			{#if editingTeam}
				<form method="POST" action="?/update" use:enhance onsubmit={() => closeSheets()} class="space-y-4 py-4">
					<input type="hidden" name="id" value={editingTeam.id} />

					<div class="grid grid-cols-2 gap-4">
						<div class="grid gap-2">
							<Label for="editTeamNumber">Team Number *</Label>
							<Input id="editTeamNumber" name="teamNumber" bind:value={formTeamNumber} required />
						</div>
						<div class="grid gap-2">
							<Label for="editName">Team Name *</Label>
							<Input id="editName" name="name" bind:value={formName} required />
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="grid gap-2">
							<Label for="editSchool">School *</Label>
							<Input id="editSchool" name="school" bind:value={formSchool} required />
						</div>
						<div class="grid gap-2">
							<Label for="editLocation">Location</Label>
							<Input id="editLocation" name="location" bind:value={formLocation} />
						</div>
					</div>

					<div class="grid gap-2">
						<Label for="editCompetitionIds">Competitions</Label>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger class="w-full">
								{#snippet child({ props })}
									<button
										type="button"
										{...props}
										class="dark:bg-input/30 border-input h-8 rounded-none border bg-transparent px-2.5 py-1 text-xs text-slate-100 w-full flex items-center justify-between"
									>
										<span class="truncate">{formCompetitionIds && formCompetitionIds.length ? getCompetitionNames(formCompetitionIds) : 'Select competitions'}</span>
										<CaretDownIcon class="text-muted-foreground size-4" />
									</button>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-60">
								<div class="p-2 w-60">
									<Input placeholder="Search competitions..." bind:value={competitionSearch} onclick={(e) => e.stopPropagation()} />
									<div class="mt-2 max-h-48 overflow-auto">
										{#each filteredCompetitions as comp}
											<label class="flex items-center gap-2 p-2 rounded hover:bg-slate-800 cursor-pointer" onclick={(e) => { e.stopPropagation(); toggleCompetition(comp.id); }}>
												<Checkbox checked={formCompetitionIds.includes(comp.id)} />
												<span class="text-sm text-slate-100">{comp.name}</span>
											</label>
										{/each}
										{#if filteredCompetitions.length === 0}
											<div class="p-2 text-sm text-slate-400">No competitions</div>
										{/if}
									</div>
									<div class="mt-2 flex justify-between gap-2">
										<Button variant="ghost" size="sm" type="button" onclick={(e) => { e.stopPropagation(); selectAll(); }}>Select all</Button>
										<Button variant="ghost" size="sm" type="button" onclick={(e) => { e.stopPropagation(); clearAll(); }}>Clear</Button>
									</div>
								</div>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
						{#each formCompetitionIds as id}
							<input type="hidden" name="competitionIds" value={id} />
						{/each}
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="grid gap-2">
							<Label for="editCoach">Coach Name</Label>
							<Input id="editCoach" name="coach" bind:value={formCoach} />
						</div>
						<div class="grid gap-2">
							<Label for="editRobotName">Robot Name</Label>
							<Input id="editRobotName" name="robotName" bind:value={formRobotName} />
						</div>
					</div>

					<fieldset class="border rounded-md p-4 space-y-4">
						<legend class="text-sm font-medium px-2 text-muted-foreground">Representatives</legend>
						<div class="grid grid-cols-2 gap-4">
							<div class="grid gap-2">
								<Label for="editRepEmail">Rep Email</Label>
								<Input id="editRepEmail" type="email" name="representativeEmail" bind:value={formRepEmail} />
							</div>
							<div class="grid gap-2">
								<Label for="editRepPhone">Rep Phone</Label>
								<Input id="editRepPhone" name="representativePhone" bind:value={formRepPhone} />
							</div>
						</div>
					</fieldset>
					
					<fieldset class="border rounded-md p-4 space-y-4">
						<legend class="text-sm font-medium px-2 text-muted-foreground">Teachers</legend>
						<div class="grid grid-cols-3 gap-2">
							<div class="grid gap-2">
								<Label for="editTeacherName">Name</Label>
								<Input id="editTeacherName" name="teacherName" bind:value={formTeacherName} />
							</div>
							<div class="grid gap-2">
								<Label for="editTeacherEmail">Email</Label>
								<Input id="editTeacherEmail" type="email" name="teacherEmail" bind:value={formTeacherEmail} />
							</div>
							<div class="grid gap-2">
								<Label for="editTeacherPhone">Phone</Label>
								<Input id="editTeacherPhone" name="teacherPhone" bind:value={formTeacherPhone} />
							</div>
						</div>
					</fieldset>

					<div class="grid gap-2">
						<Label for="editMembers">Members (comma separated)</Label>
						<Input id="editMembers" bind:value={formMembersStr} />
						<input type="hidden" name="members" value={membersJson} />
					</div>
					
					<div class="grid gap-2">
						<Label for="editMemberDetails">Member Details (JSON)</Label>
						<Textarea id="editMemberDetails" name="memberDetails" bind:value={formMemberDetailsStr} />
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
