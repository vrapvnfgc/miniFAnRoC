<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { api } from '$lib/api';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	let isCreateSheetOpen = $state(false);
	let isEditSheetOpen = $state(false);
	let showDeleteConfirm = $state(false);
	let deleteMatchId = $state<string | null>(null);
	let deleteMatchNumber = $state(0);
	let editingMatch = $state<any>(null);
	let matchScores = $state<Record<string, { redScore: number; blueScore: number }>>({});

	// Form fields
	let formMatchNumber = $state('');
	let formPhase = $state('qualification');
	let formFieldId = $state('');
	let formRedTeam1 = $state('');
	let formRedTeam2 = $state('');
	let formBlueTeam1 = $state('');
	let formBlueTeam2 = $state('');
	let formScheduledTime = $state('');
	let formNotes = $state('');

	function openCreateSheet() {
		formMatchNumber = '';
		formPhase = 'qualification';
		formFieldId = '';
		formRedTeam1 = '';
		formRedTeam2 = '';
		formBlueTeam1 = '';
		formBlueTeam2 = '';
		formScheduledTime = '';
		formNotes = '';
		isCreateSheetOpen = true;
	}

	function closeSheets() {
		isCreateSheetOpen = false;
		isEditSheetOpen = false;
		editingMatch = null;
	}

	async function submitForm(e: Event) {
		e?.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		if (!form) return;

		const action = form.getAttribute('action') || window.location.pathname;
		const method = (form.getAttribute('method') || 'POST').toUpperCase();
		const formData = new FormData(form);

		try {
			console.log('submitForm called', action, method);
			const res = await fetch(action, {
				method,
				body: formData,
				credentials: 'same-origin'
			});
			console.log('Form submit response status:', res.status);
			const text = await res.text().catch(() => null);
			console.log('Form submit response body:', text);

			if (!res.ok) {
				console.error('Form submit failed', res.status, text);
				return;
			}

			await invalidateAll();
			closeSheets();
		} catch (err) {
			console.error('Form submit error', err);
		}
	}

	function openEditSheet(match: any) {
		editingMatch = match;
		formMatchNumber = match.matchNumber.toString();
		formPhase = match.phase;
		formFieldId = match.fieldId;
		formRedTeam1 = match.redTeamIds[0];
		formRedTeam2 = match.redTeamIds[1];
		formBlueTeam1 = match.blueTeamIds[0];
		formBlueTeam2 = match.blueTeamIds[1];
		formScheduledTime = match.scheduledTime ? new Date(match.scheduledTime).toISOString().slice(0, 16) : '';
		formNotes = match.notes || '';
		isEditSheetOpen = true;
	}

	function openDeleteConfirm(match: any) {
		deleteMatchId = match.id;
		deleteMatchNumber = match.matchNumber;
		showDeleteConfirm = true;
	}

	function closeDeleteConfirm() {
		showDeleteConfirm = false;
		deleteMatchId = null;
		deleteMatchNumber = 0;
	}

	function getTeamName(teamId: string): string {
		const team = data.teams.find(t => t.id === teamId);
		return team ? `${team.teamNumber} - ${team.name}` : 'Unknown Team';
	}

	function getFieldName(fieldId: string): string {
		const field = data.fields.find(f => f.id === fieldId);
		return field ? field.name : 'Unknown Field';
	}

	function formatDateTime(date: string | Date | undefined): string {
		if (!date) return 'Not scheduled';
		const d = new Date(date);
		return d.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const finishedMatches = $derived.by(() => {
		return data.matches
			.filter((m: any) => m.status === 'finished')
			.sort((a: any, b: any) => {
				const timeA = new Date(b.endTime || b.updatedAt).getTime();
				const timeB = new Date(a.endTime || a.updatedAt).getTime();
				return timeA - timeB;
			});
	});

	const unplayedMatches = $derived.by(() => {
		return data.matches
			.filter((m: any) => m.status !== 'finished')
			.sort((a: any, b: any) => {
				if (!a.scheduledTime && !b.scheduledTime) return 0;
				if (!a.scheduledTime) return 1;
				if (!b.scheduledTime) return -1;
				return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
			});
	});

	onMount(async () => {
		if (typeof window !== 'undefined') {
			console.log('Matches page mounted (client)');
			// listen for any submit events for debugging
			document.addEventListener(
				'submit',
				(e) => {
					console.log('document submit event', e.target);
				},
				true
			);
		}
		// Load scores for finished matches
		const scores: Record<string, { redScore: number; blueScore: number }> = {};
		for (const match of finishedMatches) {
			const scoreRes = await api.scores.getByMatchId(match.id);
			if (scoreRes.data && scoreRes.data.score) {
				scores[match.id] = {
					redScore: scoreRes.data.score.red.total || 0,
					blueScore: scoreRes.data.score.blue.total || 0
				};
			} else {
				scores[match.id] = { redScore: 0, blueScore: 0 };
			}
		}
		matchScores = scores;
	});
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Matches</h1>
			<p class="text-muted-foreground">Manage matches and schedule tournaments.</p>
		</div>
		<Button onclick={openCreateSheet} size="lg">+ Add Match</Button>
	</div>

	{#if data.error}
		<div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
			<p class="font-medium">{data.error}</p>
		</div>
	{/if}

	<!-- Finished Matches Section -->
	{#if finishedMatches.length > 0}
		<div class="space-y-2">
			<h2 class="text-xl font-semibold text-slate-100">Finished Matches</h2>
			<div class="overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-lg">
				<Table.Root>
					<Table.Header>
						<Table.Row class="border-b border-slate-700 bg-slate-800 hover:bg-slate-800">
							<Table.Head class="font-semibold text-slate-100">Match #</Table.Head>
							<Table.Head class="font-semibold text-slate-100">Phase</Table.Head>
							<Table.Head class="font-semibold text-slate-100">Red Alliance</Table.Head>
							<Table.Head class="font-semibold text-slate-100">Score</Table.Head>
							<Table.Head class="font-semibold text-slate-100">Blue Alliance</Table.Head>
							<Table.Head class="font-semibold text-slate-100">Location</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each finishedMatches as match (match.id)}
							<Table.Row class="border-b border-slate-700 hover:bg-slate-800 transition-colors">
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
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	{/if}

	<!-- Unplayed Matches Section -->
	{#if unplayedMatches.length > 0}
		<div class="space-y-2">
			<h2 class="text-xl font-semibold text-slate-100">Upcoming Matches</h2>
			<div class="overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-lg">
				<Table.Root>
					<Table.Header>
						<Table.Row class="border-b border-slate-700 bg-slate-800 hover:bg-slate-800">
							<Table.Head class="font-semibold text-slate-100">Match #</Table.Head>
							<Table.Head class="font-semibold text-slate-100">Phase</Table.Head>
							<Table.Head class="font-semibold text-slate-100">Red Alliance</Table.Head>
							<Table.Head class="font-semibold text-slate-100">Blue Alliance</Table.Head>
							<Table.Head class="font-semibold text-slate-100">Status</Table.Head>
							<Table.Head class="font-semibold text-slate-100">Scheduled Time</Table.Head>
							<Table.Head class="font-semibold text-slate-100">Location</Table.Head>
							<Table.Head class="font-semibold text-slate-100">Actions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each unplayedMatches as match (match.id)}
							<Table.Row class="border-b border-slate-700 hover:bg-slate-800 transition-colors">
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
								<Table.Cell class="text-slate-300">{formatDateTime(match.scheduledTime)}</Table.Cell>
								<Table.Cell class="text-slate-300">{getFieldName(match.fieldId)}</Table.Cell>
								<Table.Cell>
									<div class="flex gap-2">
										<Button onclick={() => openEditSheet(match)} size="sm" variant="outline" class="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border-blue-600/50">Edit</Button>
										<Button onclick={() => openDeleteConfirm(match)} size="sm" variant="destructive" class="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
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
			<Button onclick={openCreateSheet} class="bg-cyan-600 hover:bg-cyan-700 text-white">Create Match</Button>
		</div>
	{/if}

	<!-- Create Sheet -->
	<Sheet.Root open={isCreateSheetOpen} onOpenChange={(open) => isCreateSheetOpen = open}>
		<Sheet.Content class="w-[400px] sm:w-[540px] max-h-screen overflow-y-auto">
			<Sheet.Header>
				<Sheet.Title>Create New Match</Sheet.Title>
				<Sheet.Description>
					Create a new match between 4 teams (2 per alliance).
				</Sheet.Description>
			</Sheet.Header>

			<form 
				method="POST" 
				action="?/create" 
				on:submit|preventDefault={submitForm}
				class="space-y-4 py-4"
			>
				<div class="grid gap-2">
					<Label for="matchNumber">Match Number *</Label>
					<Input 
						id="matchNumber" 
						name="matchNumber" 
						type="number"
						placeholder="e.g., 1"
						bind:value={formMatchNumber}
						required 
					/>
				</div>

				<div class="grid gap-2">
					<Label for="phase">Phase *</Label>
					<select 
						id="phase" 
						name="phase" 
						bind:value={formPhase}
						class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
						required
					>
						<option value="qualification">Qualification</option>
						<option value="semifinal">Semifinal</option>
						<option value="final">Final</option>
					</select>
				</div>

				<div class="grid gap-2">
					<Label for="fieldId">Location *</Label>
					<select 
						id="fieldId" 
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

				<div class="space-y-2 rounded-lg border border-slate-700 bg-slate-800/50 p-3">
					<h3 class="font-semibold text-slate-100">Red Alliance *</h3>
					<div class="grid gap-2">
						<Label for="redTeam1">Team 1</Label>
						<select 
							id="redTeam1" 
							name="redTeam1" 
							bind:value={formRedTeam1}
							class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
							required
						>
							<option value="">Select a team...</option>
							{#each data.teams as team}
								<option value={team.id}>{team.teamNumber} - {team.name}</option>
							{/each}
						</select>
					</div>
					<div class="grid gap-2">
						<Label for="redTeam2">Team 2</Label>
						<select 
							id="redTeam2" 
							name="redTeam2" 
							bind:value={formRedTeam2}
							class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
							required
						>
							<option value="">Select a team...</option>
							{#each data.teams as team}
								<option value={team.id}>{team.teamNumber} - {team.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="space-y-2 rounded-lg border border-slate-700 bg-slate-800/50 p-3">
					<h3 class="font-semibold text-slate-100">Blue Alliance *</h3>
					<div class="grid gap-2">
						<Label for="blueTeam1">Team 1</Label>
						<select 
							id="blueTeam1" 
							name="blueTeam1" 
							bind:value={formBlueTeam1}
							class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value="">Select a team...</option>
							{#each data.teams as team}
								<option value={team.id}>{team.teamNumber} - {team.name}</option>
							{/each}
						</select>
					</div>
					<div class="grid gap-2">
						<Label for="blueTeam2">Team 2</Label>
						<select 
							id="blueTeam2" 
							name="blueTeam2" 
							bind:value={formBlueTeam2}
							class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value="">Select a team...</option>
							{#each data.teams as team}
								<option value={team.id}>{team.teamNumber} - {team.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="grid gap-2">
					<Label for="scheduledTime">Scheduled Time</Label>
					<Input 
						id="scheduledTime" 
						name="scheduledTime" 
						type="datetime-local"
						bind:value={formScheduledTime}
					/>
				</div>

				<div class="grid gap-2">
					<Label for="notes">Notes</Label>
					<Input 
						id="notes" 
						name="notes" 
						placeholder="Any additional notes..."
						bind:value={formNotes}
					/>
				</div>

				<div class="flex gap-2">
					<Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
					<Button type="submit" class="flex-1">Create Match</Button>
				</div>
			</form>
		</Sheet.Content>
	</Sheet.Root>

	<!-- Edit Sheet -->
	<Sheet.Root open={isEditSheetOpen} onOpenChange={(open) => isEditSheetOpen = open}>
		<Sheet.Content class="w-[400px] sm:w-[540px] max-h-screen overflow-y-auto">
			<Sheet.Header>
				<Sheet.Title>Edit Match</Sheet.Title>
				<Sheet.Description>
					Update match details between 4 teams (2 per alliance).
				</Sheet.Description>
			</Sheet.Header>

			{#if editingMatch}
				<form 
					method="POST" 
					action="?/edit" 
					on:submit|preventDefault={submitForm}
					class="space-y-4 py-4"
				>
					<input type="hidden" name="matchId" value={editingMatch.id} />

				<div class="grid gap-2">
					<Label for="editMatchNumber">Match Number *</Label>
					<Input 
						id="editMatchNumber" 
						name="matchNumber" 
						type="number"
						placeholder="e.g., 1"
						bind:value={formMatchNumber}
						required 
					/>
				</div>

				<div class="grid gap-2">
					<Label for="editPhase">Phase *</Label>
					<select 
						id="editPhase" 
						name="phase" 
						bind:value={formPhase}
						class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
						required
					>
						<option value="qualification">Qualification</option>
						<option value="semifinal">Semifinal</option>
						<option value="final">Final</option>
					</select>
				</div>

				<div class="grid gap-2">
					<Label for="editFieldId">Location *</Label>
					<select 
						id="editFieldId" 
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

				<div class="space-y-2 rounded-lg border border-slate-700 bg-slate-800/50 p-3">
					<h3 class="font-semibold text-slate-100">Red Alliance *</h3>
					<div class="grid gap-2">
						<Label for="editRedTeam1">Team 1</Label>
						<select 
							id="editRedTeam1" 
							name="redTeam1" 
							bind:value={formRedTeam1}
							class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
							required
						>
							<option value="">Select a team...</option>
							{#each data.teams as team}
								<option value={team.id}>{team.teamNumber} - {team.name}</option>
							{/each}
						</select>
					</div>
					<div class="grid gap-2">
						<Label for="editRedTeam2">Team 2</Label>
						<select 
							id="editRedTeam2" 
							name="redTeam2" 
							bind:value={formRedTeam2}
							class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
							required
						>
							<option value="">Select a team...</option>
							{#each data.teams as team}
								<option value={team.id}>{team.teamNumber} - {team.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="space-y-2 rounded-lg border border-slate-700 bg-slate-800/50 p-3">
					<h3 class="font-semibold text-slate-100">Blue Alliance *</h3>
					<div class="grid gap-2">
						<Label for="editBlueTeam1">Team 1</Label>
						<select 
							id="editBlueTeam1" 
							name="blueTeam1" 
							bind:value={formBlueTeam1}
							class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value="">Select a team...</option>
							{#each data.teams as team}
								<option value={team.id}>{team.teamNumber} - {team.name}</option>
							{/each}
						</select>
					</div>
					<div class="grid gap-2">
						<Label for="editBlueTeam2">Team 2</Label>
						<select 
							id="editBlueTeam2" 
							name="blueTeam2" 
							bind:value={formBlueTeam2}
							class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value="">Select a team...</option>
							{#each data.teams as team}
								<option value={team.id}>{team.teamNumber} - {team.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="grid gap-2">
					<Label for="editScheduledTime">Scheduled Time</Label>
					<Input 
						id="editScheduledTime" 
						name="scheduledTime" 
						type="datetime-local"
						bind:value={formScheduledTime}
					/>
				</div>

				<div class="grid gap-2">
					<Label for="editNotes">Notes</Label>
					<Input 
						id="editNotes" 
						name="notes" 
						placeholder="Any additional notes..."
						bind:value={formNotes}
					/>
				</div>

				<div class="flex gap-2">
					<Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
					<Button type="submit" class="flex-1">Update Match</Button>
				</div>
			</form>
			{/if}
		</Sheet.Content>
	</Sheet.Root>

	<!-- Delete Confirmation Modal -->
	{#if showDeleteConfirm}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<Alert.Root class="w-96">
				<div class="flex flex-col gap-4">
					<div>
						<h2 class="text-lg font-semibold">Delete Match</h2>
						<p class="text-sm text-muted-foreground">Are you sure you want to delete <strong>Match #{deleteMatchNumber}</strong>? This action cannot be undone.</p>
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
							<input type="hidden" name="matchId" value={deleteMatchId} />
							<Button variant="destructive" type="submit">Delete</Button>
						</form>
					</div>
				</div>
			</Alert.Root>
		</div>
	{/if}
</div>
