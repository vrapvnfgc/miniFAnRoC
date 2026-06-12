<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { connectToField, disconnectFromField, fieldState, isConnected, finalizeScore, updateScore } from '$lib/stores/socket';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		connectToField(data.fieldId);
	});

	onDestroy(() => {
		disconnectFromField();
	});

	// Referees can also adjust score if needed, but it's identical logic.
	function adjustScore(alliance: 'red' | 'blue', key: 'teleIndependent' | 'sharedScore' | 'endgame' | 'penalties', amount: number) {
		if (!$fieldState) return;
		const current = $fieldState.liveScore[alliance][key] || 0;
		updateScore(data.fieldId, alliance, { [key]: Math.max(0, current + amount) });
	}

	function setMultiplier(alliance: 'red' | 'blue', val: number) {
		if (!$fieldState) return;
		updateScore(data.fieldId, alliance, { balanceMultiplier: val });
	}

	function revertToDraft() {
		if (!$fieldState) return;
		// A real implementation would add an event in WS for this
		// Here we just mutate it using the updateScore cheat if backend allowed, 
		// but since backend doesn't allow updateScore when not draft, we need to add `revertScore` to WS.
		// For now, assume WS handles it. Let's just say we can't revert without WS.
	}

	import { api } from '$lib/api';

	async function handleFinalizeScore() {
		if (!$fieldState || !$fieldState.matchId) {
			alert('No active match to finalize!');
			return;
		}

		try {
			// Save the score
			await api.scores.save($fieldState.matchId, {
				red: {
					teleIndependent: $fieldState.liveScore.red.teleIndependent || 0,
					sharedScore: $fieldState.liveScore.red.sharedScore || 0,
					penalties: $fieldState.liveScore.red.penalties || 0,
					endgame: $fieldState.liveScore.red.endgame || 0,
					balanceMultiplier: $fieldState.liveScore.red.balanceMultiplier || 1
				},
				blue: {
					teleIndependent: $fieldState.liveScore.blue.teleIndependent || 0,
					sharedScore: $fieldState.liveScore.blue.sharedScore || 0,
					penalties: $fieldState.liveScore.blue.penalties || 0,
					endgame: $fieldState.liveScore.blue.endgame || 0,
					balanceMultiplier: $fieldState.liveScore.blue.balanceMultiplier || 1
				},
				status: 'submitted'
			});

			// Mark score as finalized
			await api.scores.finalize($fieldState.matchId);

			// Mark match as finished
			await api.matches.update($fieldState.matchId, {
				status: 'finished'
			});

			// Let the field state know so other clients update
			finalizeScore(data.fieldId);
		} catch (error) {
			console.error('Failed to finalize score to backend:', error);
			alert('Failed to save score to backend. See console for details.');
		}
	}
</script>

<div class="p-4 max-w-6xl mx-auto space-y-6">
	<div class="flex items-center justify-between bg-zinc-900 p-4 rounded-lg border border-zinc-800">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-yellow-500">Head Referee Finalization</h1>
			<p class="text-zinc-400">Field: {data.fieldId}</p>
		</div>
		<div class="flex items-center gap-6">
			<div class="text-center">
				<div class="text-sm text-zinc-500 font-bold tracking-widest">SCORE STATUS</div>
				<div class={`text-xl font-bold uppercase ${$fieldState?.liveScore.status === 'submitted' ? 'text-yellow-400' : $fieldState?.liveScore.status === 'finalized' ? 'text-green-500' : 'text-zinc-500'}`}>
					{$fieldState?.liveScore.status || 'OFFLINE'}
				</div>
			</div>
		</div>
	</div>

	{#if $fieldState}
		{#if $fieldState.liveScore.status === 'draft'}
			<div class="bg-zinc-800/50 border border-zinc-700 text-zinc-300 p-8 rounded-lg text-center font-bold text-xl">
				Waiting for Scorekeeper to submit the score...
			</div>
		{:else}
			<div class="grid grid-cols-2 gap-8">
				<!-- RED ALLIANCE -->
				<div class="bg-red-950/20 border-2 border-red-900 rounded-xl overflow-hidden flex flex-col">
					<div class="bg-red-900 p-4 text-center">
						<h2 class="text-2xl font-bold text-white">RED ALLIANCE</h2>
						<div class="text-5xl font-black text-white mt-4">{$fieldState.liveScore.red.total}</div>
					</div>
					<div class="p-6 space-y-6 flex-1">
						{#each [
							{ key: 'teleIndependent', label: 'TeleOp Independent', val: $fieldState.liveScore.red.teleIndependent },
							{ key: 'sharedScore', label: 'Shared Score', val: $fieldState.liveScore.red.sharedScore },
							{ key: 'endgame', label: 'Endgame Tasks', val: $fieldState.liveScore.red.endgame },
							{ key: 'penalties', label: 'Penalties (Deductions)', val: $fieldState.liveScore.red.penalties }
						] as field}
							<div class="flex items-center justify-between border-b border-red-900/30 pb-2">
								<span class="font-semibold text-lg text-red-100">{field.label}</span>
								<span class="text-2xl font-bold text-white">{field.val || 0}</span>
							</div>
						{/each}
						<div class="flex items-center justify-between pt-2">
							<span class="font-semibold text-lg text-red-100">Balance Multiplier</span>
							<span class="text-2xl font-bold text-white">{$fieldState.liveScore.red.balanceMultiplier || 1}x</span>
						</div>
					</div>
				</div>

				<!-- BLUE ALLIANCE -->
				<div class="bg-blue-950/20 border-2 border-blue-900 rounded-xl overflow-hidden flex flex-col">
					<div class="bg-blue-900 p-4 text-center">
						<h2 class="text-2xl font-bold text-white">BLUE ALLIANCE</h2>
						<div class="text-5xl font-black text-white mt-4">{$fieldState.liveScore.blue.total}</div>
					</div>
					<div class="p-6 space-y-6 flex-1">
						{#each [
							{ key: 'teleIndependent', label: 'TeleOp Independent', val: $fieldState.liveScore.blue.teleIndependent },
							{ key: 'sharedScore', label: 'Shared Score', val: $fieldState.liveScore.blue.sharedScore },
							{ key: 'endgame', label: 'Endgame Tasks', val: $fieldState.liveScore.blue.endgame },
							{ key: 'penalties', label: 'Penalties (Deductions)', val: $fieldState.liveScore.blue.penalties }
						] as field}
							<div class="flex items-center justify-between border-b border-blue-900/30 pb-2">
								<span class="font-semibold text-lg text-blue-100">{field.label}</span>
								<span class="text-2xl font-bold text-white">{field.val || 0}</span>
							</div>
						{/each}
						<div class="flex items-center justify-between pt-2">
							<span class="font-semibold text-lg text-blue-100">Balance Multiplier</span>
							<span class="text-2xl font-bold text-white">{$fieldState.liveScore.blue.balanceMultiplier || 1}x</span>
						</div>
					</div>
				</div>
			</div>

			<div class="flex justify-center gap-4 pt-8">
				<Button 
					size="lg" 
					class="bg-green-600 hover:bg-green-700 text-xl px-16 py-8 h-auto font-bold"
					disabled={$fieldState.liveScore.status === 'finalized'}
					onclick={handleFinalizeScore}
				>
					FINALIZE MATCH
				</Button>
			</div>
		{/if}
	{/if}
</div>
