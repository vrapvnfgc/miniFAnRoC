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

	let { data }: { data: PageData & { teams?: any[]; fields?: any[]; competitions?: any[]; matches?: any[]; error?: string } } = $props();

	let isCreateSheetOpen = $state(false);
	let isEditSheetOpen = $state(false);
	let isScoreSheetOpen = $state(false);
	let isEditFinishedMatchOpen = $state(false);
	let showDeleteConfirm = $state(false);
	let deleteMatchId = $state<string | null>(null);
	let deleteMatchNumber = $state(0);
	let deleteIsFinished = $state(false);
	let editingMatch = $state<any>(null);
	let editingFinishedMatch = $state<any>(null);
	let scoringMatch = $state<any>(null);
	let matchScores = $state<Record<string, { redScore: number; blueScore: number }>>({});

	// Score form state
	let redTeleIndependent = $state(0);
	let redShared = $state(0);
	let redPenalties = $state(0);
	let redEndgame = $state(0);
	let redBalanceMultiplier = $state(1);

	let blueTeleIndependent = $state(0);
	let blueShared = $state(0);
	let bluePenalties = $state(0);
	let blueEndgame = $state(0);
	let blueBalanceMultiplier = $state(1);

	// Form fields
	let formMatchNumber = $state('');
	let formPhase = $state('qualification');
	let formFieldId = $state('');
	let formCompetitionId = $state('');
	// Page filter: show matches for a specific competition ('' = All)
	let filterCompetitionId = $state('');
	let formRedTeam1 = $state('');
	let formRedTeam2 = $state('');
	let formBlueTeam1 = $state('');
	let formBlueTeam2 = $state('');
	let formScheduledTime = $state('');
	let formNotes = $state('');

	// Available teams for the currently selected competition (create sheet)
	const availableTeams = $derived.by(() => {
		if (!formCompetitionId) return [];
		return (data.teams || []).filter((t: any) => (t.competitionIds || []).includes(formCompetitionId)).sort((a: any, b: any) => a.teamNumber.localeCompare(b.teamNumber));
	});

	// When creating a match and competition changes, clear team selections that are no longer valid
	$effect(() => {
		// Clear invalid selections when any match-edit sheet is open
		if (!(isCreateSheetOpen || isEditSheetOpen || isEditFinishedMatchOpen)) return;
		const ids = new Set((availableTeams || []).map((t: any) => t.id));
		if (formRedTeam1 && !ids.has(formRedTeam1)) formRedTeam1 = '';
		if (formRedTeam2 && !ids.has(formRedTeam2)) formRedTeam2 = '';
		if (formBlueTeam1 && !ids.has(formBlueTeam1)) formBlueTeam1 = '';
		if (formBlueTeam2 && !ids.has(formBlueTeam2)) formBlueTeam2 = '';
	});

	// Available lists per select to prevent duplicate team choices
	const availableRedTeam1 = $derived.by(() => {
		const base = formCompetitionId ? (availableTeams || []) : (data.teams || []);
		return base.filter((t: any) => t.id !== formRedTeam2 && t.id !== formBlueTeam1 && t.id !== formBlueTeam2);
	});

	const availableRedTeam2 = $derived.by(() => {
		const base = formCompetitionId ? (availableTeams || []) : (data.teams || []);
		return base.filter((t: any) => t.id !== formRedTeam1 && t.id !== formBlueTeam1 && t.id !== formBlueTeam2);
	});

	const availableBlueTeam1 = $derived.by(() => {
		const base = formCompetitionId ? (availableTeams || []) : (data.teams || []);
		return base.filter((t: any) => t.id !== formRedTeam1 && t.id !== formRedTeam2 && t.id !== formBlueTeam2);
	});

	const availableBlueTeam2 = $derived.by(() => {
		const base = formCompetitionId ? (availableTeams || []) : (data.teams || []);
		return base.filter((t: any) => t.id !== formRedTeam1 && t.id !== formRedTeam2 && t.id !== formBlueTeam1);
	});

	// Disable create when competition not selected, teams missing, or duplicates exist
	const createDisabled = $derived.by(() => {
		if (!formCompetitionId) return true;
		const sel = [formRedTeam1, formRedTeam2, formBlueTeam1, formBlueTeam2];
		if (sel.some((s) => !s)) return true;
		return new Set(sel).size !== 4;
	});

	function openCreateSheet() {
		formMatchNumber = '';
		formPhase = 'qualification';
		formFieldId = '';
		formCompetitionId = '';
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
		isEditFinishedMatchOpen = false;
		isScoreSheetOpen = false;
		editingMatch = null;
		editingFinishedMatch = null;
		scoringMatch = null;
	}

	async function submitForm(e: Event) {
		e?.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		if (!form) return;

		const action = form.getAttribute('action') || window.location.pathname;
		const method = (form.getAttribute('method') || 'POST').toUpperCase();
		const formData = new FormData(form);
		const matchId = formData.get('matchId')?.toString();

		try {
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

			// If this is a finishMatch action, fetch and display the score immediately
			if (action.includes('finishMatch') && matchId) {
				const scoreRes = await api.scores.getByMatchId(matchId);
				if (scoreRes.data?.score) {
					matchScores[matchId] = {
						redScore: scoreRes.data.score.red.total || 0,
						blueScore: scoreRes.data.score.blue.total || 0
					};
				}
			}

			await invalidateAll();
			
			// Reload all scores after invalidation
			await loadScores();
			
			closeSheets();
		} catch (err) {
			console.error('Form submit error', err);
		}
	}

	async function loadScores() {
		const scores: Record<string, { redScore: number; blueScore: number }> = {};
		for (const match of finishedMatches) {
			try {
				const scoreRes = await api.scores.getByMatchId(match.id);
				if (scoreRes.data && scoreRes.data.score) {
					scores[match.id] = {
						redScore: scoreRes.data.score.red.total || 0,
						blueScore: scoreRes.data.score.blue.total || 0
					};
				} else {
					scores[match.id] = { redScore: 0, blueScore: 0 };
				}
			} catch (err) {
				console.error('Failed to load score for match:', match.id, err);
				scores[match.id] = { redScore: 0, blueScore: 0 };
			}
		}
		matchScores = scores;
	}

	function openEditSheet(match: any) {
		editingMatch = match;
		formMatchNumber = match.matchNumber.toString();
		formPhase = match.phase;
		formFieldId = match.fieldId;
		formCompetitionId = match.competitionId || '';
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
		deleteIsFinished = match.status === 'finished';
		showDeleteConfirm = true;
	}

	async function openEditFinishedMatchSheet(match: any) {
		editingFinishedMatch = match;
		formMatchNumber = match.matchNumber.toString();
		formPhase = match.phase;
		formFieldId = match.fieldId;
		formCompetitionId = match.competitionId || '';
		formRedTeam1 = match.redTeamIds[0];
		formRedTeam2 = match.redTeamIds[1];
		formBlueTeam1 = match.blueTeamIds[0];
		formBlueTeam2 = match.blueTeamIds[1];
		formScheduledTime = match.scheduledTime ? new Date(match.scheduledTime).toISOString().slice(0, 16) : '';
		formNotes = match.notes || '';

		// Load the score for this match
		try {
			const scoreRes = await api.scores.getByMatchId(match.id);
			if (scoreRes.data?.score) {
				redTeleIndependent = scoreRes.data.score.red.teleIndependent || 0;
				redShared = scoreRes.data.score.red.sharedScore || 0;
				redPenalties = scoreRes.data.score.red.penalties || 0;
				redEndgame = scoreRes.data.score.red.endgame || 0;
				redBalanceMultiplier = scoreRes.data.score.red.balanceMultiplier || 1;

				blueTeleIndependent = scoreRes.data.score.blue.teleIndependent || 0;
				blueShared = scoreRes.data.score.blue.sharedScore || 0;
				bluePenalties = scoreRes.data.score.blue.penalties || 0;
				blueEndgame = scoreRes.data.score.blue.endgame || 0;
				blueBalanceMultiplier = scoreRes.data.score.blue.balanceMultiplier || 1;
			}
		} catch (err) {
			console.error('Failed to load score:', err);
		}

		isEditFinishedMatchOpen = true;
	}

	function openScoreSheet(match: any) {
		scoringMatch = match;
		redTeleIndependent = 0;
		redShared = 0;
		redPenalties = 0;
		redEndgame = 0;
		redBalanceMultiplier = 1;
		blueTeleIndependent = 0;
		blueShared = 0;
		bluePenalties = 0;
		blueEndgame = 0;
		blueBalanceMultiplier = 1;
		isScoreSheetOpen = true;
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

	function getCompetitionName(competitionId: string | undefined): string {
		if (!competitionId) return '—';
		const competition = data.competitions.find(c => c.id === competitionId);
		return competition ? competition.name : 'Unknown Competition';
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
			.filter((m: any) => m.status === 'finished' && (!filterCompetitionId || m.competitionId === filterCompetitionId))
			.sort((a: any, b: any) => {
				const timeA = new Date(b.endTime || b.updatedAt).getTime();
				const timeB = new Date(a.endTime || a.updatedAt).getTime();
				return timeA - timeB;
			});
	});

	const unplayedMatches = $derived.by(() => {
		return data.matches
			.filter((m: any) => m.status !== 'finished' && (!filterCompetitionId || m.competitionId === filterCompetitionId))
			.sort((a: any, b: any) => {
				if (!a.scheduledTime && !b.scheduledTime) return 0;
				if (!a.scheduledTime) return 1;
				if (!b.scheduledTime) return -1;
				return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
			});
	});

	onMount(async () => {
		// Load scores for finished matches
		await loadScores();
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

	<div class="flex items-center gap-3">
		<Label for="filterCompetition">Competition</Label>
		<select
			id="filterCompetition"
			bind:value={filterCompetitionId}
			class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
		>
			<option value="">All</option>
			{#each data.competitions as comp}
				<option value={comp.id}>{comp.name}</option>
			{/each}
		</select>
	</div>

	{#if data.error}
		<div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
			<p class="font-medium">{data.error}</p>
		</div>
	{/if}

	<!-- Finished Matches Section -->
	{#if finishedMatches.length > 0}
		<div class="space-y-2">
			<h2 class="text-xl font-semibold text-slate-100">Results</h2>
			<div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
				<Table.Root>
					<Table.Header>
						<Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
							<Table.Head class="font-semibold text-zinc-100">Match #</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Phase</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Competition</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Red Alliance</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Score</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Blue Alliance</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Location</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Actions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each finishedMatches as match (match.id)}
							<Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
								<Table.Cell class="font-mono font-medium text-cyan-400">{match.matchNumber}</Table.Cell>
								<Table.Cell class="text-slate-300 capitalize">{match.phase}</Table.Cell>
								<Table.Cell class="text-slate-400">{getCompetitionName(match.competitionId)}</Table.Cell>
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
								<Table.Cell>
									<div class="flex gap-2">
										<Button onclick={() => openEditFinishedMatchSheet(match)} size="sm" variant="outline" class="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border-blue-600/50">Edit</Button>
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

	<!-- Unplayed Matches Section -->
	{#if unplayedMatches.length > 0}
		<div class="space-y-2">
			<h2 class="text-xl font-semibold text-slate-100">Upcoming Matches</h2>
			<div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
				<Table.Root>
					<Table.Header>
						<Table.Row class="border-b border-zinc-700 bg-zinc-800/70 hover:bg-zinc-800/70">
							<Table.Head class="font-semibold text-zinc-100">Match #</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Phase</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Competition</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Red Alliance</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Blue Alliance</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Status</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Scheduled Time</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Location</Table.Head>
							<Table.Head class="font-semibold text-zinc-100">Actions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each unplayedMatches as match (match.id)}
							<Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
								<Table.Cell class="font-mono font-medium text-cyan-400">{match.matchNumber}</Table.Cell>
								<Table.Cell class="text-slate-300 capitalize">{match.phase}</Table.Cell>
								<Table.Cell class="text-slate-400">{getCompetitionName(match.competitionId)}</Table.Cell>
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
										<Button onclick={() => openScoreSheet(match)} size="sm" class="bg-green-600/20 text-green-400 hover:bg-green-600/40 border border-green-600/50">Record Score</Button>
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
				onsubmit={submitForm}
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
					<Label for="competitionId">Competition *</Label>
					<select 
						id="competitionId" 
						name="competitionId" 
						bind:value={formCompetitionId}
						class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
						required
					>
						<option value="">Select a competition...</option>
						{#each data.competitions as competition}
							<option value={competition.id}>{competition.name}</option>
						{/each}
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
							disabled={!formCompetitionId}
						>
							<option value="">{formCompetitionId ? 'Select a team...' : 'Select a competition first'}</option>
							{#if formCompetitionId}
								{#each availableRedTeam1 as team}
									<option value={team.id}>{team.teamNumber} - {team.name}</option>
								{/each}
							{/if}
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
							disabled={!formCompetitionId}
						>
							<option value="">{formCompetitionId ? 'Select a team...' : 'Select a competition first'}</option>
							{#if formCompetitionId}
								{#each availableRedTeam2 as team}
									<option value={team.id}>{team.teamNumber} - {team.name}</option>
								{/each}
							{/if}
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
							disabled={!formCompetitionId}
						>
							<option value="">{formCompetitionId ? 'Select a team...' : 'Select a competition first'}</option>
							{#if formCompetitionId}
								{#each availableBlueTeam1 as team}
									<option value={team.id}>{team.teamNumber} - {team.name}</option>
								{/each}
							{/if}
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
							disabled={!formCompetitionId}
						>
							<option value="">{formCompetitionId ? 'Select a team...' : 'Select a competition first'}</option>
							{#if formCompetitionId}
								{#each availableBlueTeam2 as team}
									<option value={team.id}>{team.teamNumber} - {team.name}</option>
								{/each}
							{/if}
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
					<Button type="submit" class="flex-1" disabled={createDisabled}>Create Match</Button>
				</div>
				{#if createDisabled}
					<p class="text-sm text-red-400 mt-2">Select a competition and four distinct teams.</p>
				{/if}
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
					onsubmit={submitForm}
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
					<Label for="editCompetitionId">Competition</Label>
					<select 
						id="editCompetitionId" 
						name="competitionId" 
						bind:value={formCompetitionId}
						class="flex h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
					>
						<option value="">No Competition (Optional)</option>
						{#each data.competitions as competition}
							<option value={competition.id}>{competition.name}</option>
						{/each}
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
									<option value="">{formCompetitionId ? 'Select a team...' : 'Select a competition first'}</option>
									{#if formCompetitionId || data.teams}
										{#each availableRedTeam1 as team}
											<option value={team.id}>{team.teamNumber} - {team.name}</option>
										{/each}
									{/if}
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
							<option value="">{formCompetitionId ? 'Select a team...' : 'Select a competition first'}</option>
							{#if formCompetitionId || data.teams}
								{#each availableRedTeam2 as team}
									<option value={team.id}>{team.teamNumber} - {team.name}</option>
								{/each}
							{/if}
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
							<option value="">{formCompetitionId ? 'Select a team...' : 'Select a competition first'}</option>
							{#if formCompetitionId || data.teams}
								{#each availableBlueTeam1 as team}
									<option value={team.id}>{team.teamNumber} - {team.name}</option>
								{/each}
							{/if}
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
							<option value="">{formCompetitionId ? 'Select a team...' : 'Select a competition first'}</option>
							{#if formCompetitionId || data.teams}
								{#each availableBlueTeam2 as team}
									<option value={team.id}>{team.teamNumber} - {team.name}</option>
								{/each}
							{/if}
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

	<!-- Score Sheet -->
	<Sheet.Root open={isScoreSheetOpen} onOpenChange={(open) => isScoreSheetOpen = open}>
		<Sheet.Content class="w-[400px] sm:w-[540px] max-h-screen overflow-y-auto">
			<Sheet.Header>
				<Sheet.Title>Record Match Score</Sheet.Title>
				<Sheet.Description>
					Enter the final scores for Match {scoringMatch?.matchNumber || ''} to finish the match.
				</Sheet.Description>
			</Sheet.Header>

			{#if scoringMatch}
				<form 
					method="POST" 
					action="?/finishMatch" 
					onsubmit={submitForm}
					class="space-y-6 py-4"
				>
					<input type="hidden" name="matchId" value={scoringMatch.id} />

					<!-- Red Alliance -->
					<div class="space-y-4 rounded-lg border border-red-700 bg-red-900/20 p-4">
						<h3 class="font-semibold text-red-400">Red Alliance</h3>
						
						<div class="grid gap-3">
							<div class="grid gap-2">
								<Label for="redTeleIndependent" class="text-sm">Tele Independent Score</Label>
								<Input 
									id="redTeleIndependent" 
									name="redTeleIndependent" 
									type="number"
									step="0.5"
									min="0"
									bind:value={redTeleIndependent}
									class="bg-slate-700"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="redShared" class="text-sm">Shared Score</Label>
								<Input 
									id="redShared" 
									name="redShared" 
									type="number"
									step="0.5"
									min="0"
									bind:value={redShared}
									class="bg-slate-700"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="redPenalties" class="text-sm">Penalties</Label>
								<Input 
									id="redPenalties" 
									name="redPenalties" 
									type="number"
									step="0.5"
									min="0"
									bind:value={redPenalties}
									class="bg-slate-700"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="redEndgame" class="text-sm">Endgame Score</Label>
								<Input 
									id="redEndgame" 
									name="redEndgame" 
									type="number"
									step="0.5"
									min="0"
									bind:value={redEndgame}
									class="bg-slate-700"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="redBalanceMultiplier" class="text-sm">Balance Multiplier</Label>
								<Input 
									id="redBalanceMultiplier" 
									name="redBalanceMultiplier" 
									type="number"
									step="0.01"
									min="1"
									bind:value={redBalanceMultiplier}
									class="bg-slate-700"
									required 
								/>
							</div>
						</div>
					</div>

					<!-- Blue Alliance -->
					<div class="space-y-4 rounded-lg border border-blue-700 bg-blue-900/20 p-4">
						<h3 class="font-semibold text-blue-400">Blue Alliance</h3>
						
						<div class="grid gap-3">
							<div class="grid gap-2">
								<Label for="blueTeleIndependent" class="text-sm">Tele Independent Score</Label>
								<Input 
									id="blueTeleIndependent" 
									name="blueTeleIndependent" 
									type="number"
									step="0.5"
									min="0"
									bind:value={blueTeleIndependent}
									class="bg-slate-700"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="blueShared" class="text-sm">Shared Score</Label>
								<Input 
									id="blueShared" 
									name="blueShared" 
									type="number"
									step="0.5"
									min="0"
									bind:value={blueShared}
									class="bg-slate-700"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="bluePenalties" class="text-sm">Penalties</Label>
								<Input 
									id="bluePenalties" 
									name="bluePenalties" 
									type="number"
									step="0.5"
									min="0"
									bind:value={bluePenalties}
									class="bg-slate-700"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="blueEndgame" class="text-sm">Endgame Score</Label>
								<Input 
									id="blueEndgame" 
									name="blueEndgame" 
									type="number"
									step="0.5"
									min="0"
									bind:value={blueEndgame}
									class="bg-slate-700"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="blueBalanceMultiplier" class="text-sm">Balance Multiplier</Label>
								<Input 
									id="blueBalanceMultiplier" 
									name="blueBalanceMultiplier" 
									type="number"
									step="0.01"
									min="1"
									bind:value={blueBalanceMultiplier}
									class="bg-slate-700"
									required 
								/>
							</div>
						</div>
					</div>

					<div class="flex gap-2">
						<Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
						<Button type="submit" class="flex-1 bg-green-600 hover:bg-green-700">Finish Match & Record Score</Button>
					</div>
				</form>
			{/if}
		</Sheet.Content>
	</Sheet.Root>

	<!-- Edit Finished Match Sheet -->
	<Sheet.Root open={isEditFinishedMatchOpen} onOpenChange={(open) => isEditFinishedMatchOpen = open}>
		<Sheet.Content class="w-[400px] sm:w-[540px] max-h-screen overflow-y-auto">
			<Sheet.Header>
				<Sheet.Title>Edit Finished Match</Sheet.Title>
				<Sheet.Description>
					Update match details and/or edit the recorded score.
				</Sheet.Description>
			</Sheet.Header>

			{#if editingFinishedMatch}
				<form 
					method="POST" 
					action="?/editFinished" 
					onsubmit={submitForm}
					class="space-y-4 py-4"
				>
					<input type="hidden" name="matchId" value={editingFinishedMatch.id} />

					<!-- Match Details Section -->
					<div class="space-y-3 rounded-lg border border-zinc-700 bg-zinc-800/50 p-3">
						<h3 class="font-semibold text-zinc-100">Match Details</h3>
						
						<div class="grid gap-2">
							<Label for="editFinMatchNumber">Match Number *</Label>
							<Input 
								id="editFinMatchNumber" 
								name="matchNumber" 
								type="number"
								placeholder="e.g., 1"
								bind:value={formMatchNumber}
								required 
							/>
						</div>

						<div class="grid gap-2">
							<Label for="editFinPhase">Phase *</Label>
							<select 
								id="editFinPhase" 
								name="phase" 
								bind:value={formPhase}
								class="flex h-10 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
								required
							>
								<option value="qualification">Qualification</option>
								<option value="semifinal">Semifinal</option>
								<option value="final">Final</option>
							</select>
						</div>

						<div class="grid gap-2">
							<Label for="editFinCompetitionId">Competition</Label>
							<select 
								id="editFinCompetitionId" 
								name="competitionId" 
								bind:value={formCompetitionId}
								class="flex h-10 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
							>
								<option value="">No Competition (Optional)</option>
								{#each data.competitions as competition}
									<option value={competition.id}>{competition.name}</option>
								{/each}
							</select>
						</div>

						<div class="grid gap-2">
							<Label for="editFinFieldId">Location *</Label>
							<select 
								id="editFinFieldId" 
								name="fieldId" 
								bind:value={formFieldId}
								class="flex h-10 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
								required
							>
								<option value="">Select a location...</option>
								{#each data.fields as field}
									<option value={field.id}>{field.name}</option>
								{/each}
							</select>
						</div>

						<div class="space-y-2 rounded-lg border border-zinc-700 bg-zinc-900/50 p-2">
							<h4 class="text-sm font-semibold text-zinc-100">Red Alliance *</h4>
							<div class="grid gap-2">
								<Label for="editFinRedTeam1" class="text-xs">Team 1</Label>
								<select 
									id="editFinRedTeam1" 
									name="redTeam1" 
									bind:value={formRedTeam1}
									class="flex h-10 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
									required
								>
									<option value="">{formCompetitionId ? 'Select a team...' : 'Select a competition first'}</option>
									{#if formCompetitionId || data.teams}
										{#each availableRedTeam1 as team}
											<option value={team.id}>{team.teamNumber} - {team.name}</option>
										{/each}
									{/if}
								</select>
							</div>
							<div class="grid gap-2">
								<Label for="editFinRedTeam2" class="text-xs">Team 2</Label>
								<select 
									id="editFinRedTeam2" 
									name="redTeam2" 
									bind:value={formRedTeam2}
									class="flex h-10 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
									required
								>
									<option value="">{formCompetitionId ? 'Select a team...' : 'Select a competition first'}</option>
									{#if formCompetitionId || data.teams}
										{#each availableRedTeam2 as team}
											<option value={team.id}>{team.teamNumber} - {team.name}</option>
										{/each}
									{/if}
								</select>
							</div>
						</div>

						<div class="space-y-2 rounded-lg border border-zinc-700 bg-zinc-900/50 p-2">
							<h4 class="text-sm font-semibold text-zinc-100">Blue Alliance *</h4>
							<div class="grid gap-2">
								<Label for="editFinBlueTeam1" class="text-xs">Team 1</Label>
								<select 
									id="editFinBlueTeam1" 
									name="blueTeam1" 
									bind:value={formBlueTeam1}
									class="flex h-10 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
									required
								>
									<option value="">{formCompetitionId ? 'Select a team...' : 'Select a competition first'}</option>
									{#if formCompetitionId || data.teams}
										{#each availableBlueTeam1 as team}
											<option value={team.id}>{team.teamNumber} - {team.name}</option>
										{/each}
									{/if}
								</select>
							</div>
							<div class="grid gap-2">
								<Label for="editFinBlueTeam2" class="text-xs">Team 2</Label>
								<select 
									id="editFinBlueTeam2" 
									name="blueTeam2" 
									bind:value={formBlueTeam2}
									class="flex h-10 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
									required
								>
									<option value="">{formCompetitionId ? 'Select a team...' : 'Select a competition first'}</option>
									{#if formCompetitionId || data.teams}
										{#each availableBlueTeam2 as team}
											<option value={team.id}>{team.teamNumber} - {team.name}</option>
										{/each}
									{/if}
								</select>
							</div>
						</div>

						<div class="grid gap-2">
							<Label for="editFinScheduledTime">Scheduled Time</Label>
							<Input 
								id="editFinScheduledTime" 
								name="scheduledTime" 
								type="datetime-local"
								bind:value={formScheduledTime}
							/>
						</div>

						<div class="grid gap-2">
							<Label for="editFinNotes">Notes</Label>
							<Input 
								id="editFinNotes" 
								name="notes" 
								placeholder="Any additional notes..."
								bind:value={formNotes}
							/>
						</div>
					</div>

					<!-- Score Section -->
					<div class="space-y-4 rounded-lg border border-red-700 bg-red-900/20 p-3">
						<h3 class="font-semibold text-red-400">Red Alliance Score</h3>
						
						<div class="grid gap-3">
							<div class="grid gap-2">
								<Label for="editFinRedTeleIndependent" class="text-sm">Tele Independent Score</Label>
								<Input 
									id="editFinRedTeleIndependent" 
									name="redTeleIndependent" 
									type="number"
									step="0.5"
									min="0"
									bind:value={redTeleIndependent}
									class="bg-zinc-800 text-zinc-100"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="editFinRedShared" class="text-sm">Shared Score</Label>
								<Input 
									id="editFinRedShared" 
									name="redShared" 
									type="number"
									step="0.5"
									min="0"
									bind:value={redShared}
									class="bg-zinc-800 text-zinc-100"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="editFinRedPenalties" class="text-sm">Penalties</Label>
								<Input 
									id="editFinRedPenalties" 
									name="redPenalties" 
									type="number"
									step="0.5"
									min="0"
									bind:value={redPenalties}
									class="bg-zinc-800 text-zinc-100"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="editFinRedEndgame" class="text-sm">Endgame Score</Label>
								<Input 
									id="editFinRedEndgame" 
									name="redEndgame" 
									type="number"
									step="0.5"
									min="0"
									bind:value={redEndgame}
									class="bg-zinc-800 text-zinc-100"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="editFinRedBalanceMultiplier" class="text-sm">Balance Multiplier</Label>
								<Input 
									id="editFinRedBalanceMultiplier" 
									name="redBalanceMultiplier" 
									type="number"
									step="0.01"
									min="1"
									bind:value={redBalanceMultiplier}
									class="bg-zinc-800 text-zinc-100"
									required 
								/>
							</div>
						</div>
					</div>

					<div class="space-y-4 rounded-lg border border-blue-700 bg-blue-900/20 p-3">
						<h3 class="font-semibold text-blue-400">Blue Alliance Score</h3>
						
						<div class="grid gap-3">
							<div class="grid gap-2">
								<Label for="editFinBlueTeleIndependent" class="text-sm">Tele Independent Score</Label>
								<Input 
									id="editFinBlueTeleIndependent" 
									name="blueTeleIndependent" 
									type="number"
									step="0.5"
									min="0"
									bind:value={blueTeleIndependent}
									class="bg-zinc-800 text-zinc-100"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="editFinBlueShared" class="text-sm">Shared Score</Label>
								<Input 
									id="editFinBlueShared" 
									name="blueShared" 
									type="number"
									step="0.5"
									min="0"
									bind:value={blueShared}
									class="bg-zinc-800 text-zinc-100"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="editFinBluePenalties" class="text-sm">Penalties</Label>
								<Input 
									id="editFinBluePenalties" 
									name="bluePenalties" 
									type="number"
									step="0.5"
									min="0"
									bind:value={bluePenalties}
									class="bg-zinc-800 text-zinc-100"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="editFinBlueEndgame" class="text-sm">Endgame Score</Label>
								<Input 
									id="editFinBlueEndgame" 
									name="blueEndgame" 
									type="number"
									step="0.5"
									min="0"
									bind:value={blueEndgame}
									class="bg-zinc-800 text-zinc-100"
									required 
								/>
							</div>

							<div class="grid gap-2">
								<Label for="editFinBlueBalanceMultiplier" class="text-sm">Balance Multiplier</Label>
								<Input 
									id="editFinBlueBalanceMultiplier" 
									name="blueBalanceMultiplier" 
									type="number"
									step="0.01"
									min="1"
									bind:value={blueBalanceMultiplier}
									class="bg-zinc-800 text-zinc-100"
									required 
								/>
							</div>
						</div>
					</div>

					<div class="flex gap-2">
						<Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
						<Button type="submit" class="flex-1">Update Match & Score</Button>
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
						<p class="text-sm text-muted-foreground">
							Are you sure you want to delete <strong>Match #{deleteMatchNumber}</strong>
							{#if deleteIsFinished}
								and its recorded score
							{/if}
							? This action cannot be undone.
						</p>
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
