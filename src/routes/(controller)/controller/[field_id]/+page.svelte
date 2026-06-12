<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { connectToField, disconnectFromField, fieldState, isConnected, loadMatch, startMatch, pauseMatch, abortMatch } from '$lib/stores/socket';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let teamMap = $derived(
		(data.teams || []).reduce((acc: Record<string, string>, t: any) => {
			acc[t.id] = t.name;
			return acc;
		}, {} as Record<string, string>)
	);

	onMount(() => {
		connectToField(data.fieldId);
	});

	onDestroy(() => {
		disconnectFromField();
	});

	let selectedMatchId = $state<string>('');

	function formatTime(seconds: number) {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	function handleLoadMatch() {
		if (!selectedMatchId) return;
		const match = data.matches.find(m => m.id === selectedMatchId);
		if (match) {
			loadMatch(data.fieldId, match.id, match.redTeamIds, match.blueTeamIds);
		}
	}
</script>

<div class="p-6 max-w-4xl mx-auto space-y-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Match Controller</h1>
			<p class="text-zinc-400">Field: {data.field?.name || data.fieldId}</p>
		</div>
		<div class="flex items-center gap-2">
			<div class={`w-3 h-3 rounded-full ${$isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
			<span class="text-sm font-medium">{$isConnected ? 'Connected' : 'Disconnected'}</span>
		</div>
	</div>

	<div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
		<div class="grid grid-cols-2 gap-4 items-end">
			<div class="space-y-2">
				<label class="text-sm font-medium text-zinc-300">Select Match to Load</label>
				<select bind:value={selectedMatchId} class="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2">
					<option value="">-- Select Match --</option>
					{#each data.matches as match}
						<option value={match.id}>Match #{match.matchNumber} ({match.phase})</option>
					{/each}
				</select>
			</div>
			<Button onclick={handleLoadMatch} disabled={!selectedMatchId} class="bg-blue-600 hover:bg-blue-700">Load Match to Field</Button>
		</div>
	</div>

	{#if $fieldState}
		<div class="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center space-y-8">
			<div>
				<div class="text-xl font-semibold text-zinc-400 mb-2">CURRENT PHASE</div>
				<div class="text-4xl font-bold text-white tracking-widest">{$fieldState.status}</div>
			</div>

			<div class="text-8xl font-mono font-bold text-yellow-400 tabular-nums">
				{formatTime($fieldState.timer)}
			</div>

			<div class="flex justify-center gap-4 pt-4">
				<Button size="lg" onclick={() => startMatch(data.fieldId)} class="bg-green-600 hover:bg-green-700 w-32" disabled={$fieldState.status === 'MATCH_FINISHED'}>
					{$fieldState.status === 'IDLE' || $fieldState.status === 'PRE_MATCH' ? 'START' : 'RESUME'}
				</Button>
				<Button size="lg" variant="outline" onclick={() => pauseMatch(data.fieldId)} class="border-zinc-700 w-32" disabled={$fieldState.status === 'MATCH_FINISHED'}>
					PAUSE
				</Button>
				<Button size="lg" variant="destructive" onclick={() => abortMatch(data.fieldId)} class="bg-red-900 hover:bg-red-800 w-32">
					ABORT
				</Button>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-6">
			<!-- RED -->
			<div class="bg-red-950/30 border border-red-900/50 rounded-lg p-6">
				<h3 class="text-xl font-bold text-red-500 mb-4">RED ALLIANCE</h3>
				{#if $fieldState.teams.red.length > 0}
					<div class="flex gap-2">
						{#each $fieldState.teams.red as team}
							<span class="bg-red-900/50 text-red-100 px-3 py-1 rounded font-mono">{teamMap[team] || team}</span>
						{/each}
					</div>
				{:else}
					<p class="text-red-900/50 italic">No teams loaded</p>
				{/if}
				<div class="mt-4 text-3xl font-bold text-red-400">
					Score: {$fieldState.liveScore.red.total}
				</div>
			</div>
			<!-- BLUE -->
			<div class="bg-blue-950/30 border border-blue-900/50 rounded-lg p-6">
				<h3 class="text-xl font-bold text-blue-500 mb-4">BLUE ALLIANCE</h3>
				{#if $fieldState.teams.blue.length > 0}
					<div class="flex gap-2">
						{#each $fieldState.teams.blue as team}
							<span class="bg-blue-900/50 text-blue-100 px-3 py-1 rounded font-mono">{teamMap[team] || team}</span>
						{/each}
					</div>
				{:else}
					<p class="text-blue-900/50 italic">No teams loaded</p>
				{/if}
				<div class="mt-4 text-3xl font-bold text-blue-400">
					Score: {$fieldState.liveScore.blue.total}
				</div>
			</div>
		</div>
	{/if}
</div>
