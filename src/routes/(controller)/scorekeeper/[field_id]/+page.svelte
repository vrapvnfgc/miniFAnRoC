<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { connectToField, disconnectFromField, fieldState, isConnected, updateScore, submitScore } from '$lib/stores/socket';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		connectToField(data.fieldId);
	});

	onDestroy(() => {
		disconnectFromField();
	});

	function adjustScore(alliance: 'red' | 'blue', key: 'teleIndependent' | 'sharedScore' | 'endgame' | 'penalties', amount: number) {
		if (!$fieldState || $fieldState.liveScore.status !== 'draft') return;
		
		const current = $fieldState.liveScore[alliance][key] || 0;
		updateScore(data.fieldId, alliance, { [key]: Math.max(0, current + amount) });
	}

	function setMultiplier(alliance: 'red' | 'blue', val: number) {
		if (!$fieldState || $fieldState.liveScore.status !== 'draft') return;
		updateScore(data.fieldId, alliance, { balanceMultiplier: val });
	}
</script>

<div class="p-4 max-w-6xl mx-auto space-y-6">
	<div class="flex items-center justify-between bg-zinc-900 p-4 rounded-lg border border-zinc-800">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Live Scorekeeper</h1>
			<p class="text-zinc-400">Field: {data.fieldId}</p>
		</div>
		<div class="flex items-center gap-6">
			<div class="text-center">
				<div class="text-sm text-zinc-500 font-bold tracking-widest">STATUS</div>
				<div class="text-xl font-bold text-white">{$fieldState?.status || 'OFFLINE'}</div>
			</div>
			<div class="flex items-center gap-2">
				<div class={`w-3 h-3 rounded-full ${$isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
			</div>
		</div>
	</div>

	{#if $fieldState}
		{#if $fieldState.liveScore.status !== 'draft'}
			<div class="bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 p-4 rounded-lg text-center font-bold">
				Scores have been submitted. Editing is locked. Head Referee must finalize or revert.
			</div>
		{/if}

		<div class="grid grid-cols-2 gap-8">
			<!-- RED ALLIANCE -->
			<div class="bg-red-950/20 border-2 border-red-900 rounded-xl overflow-hidden flex flex-col">
				<div class="bg-red-900 p-4 text-center">
					<h2 class="text-2xl font-bold text-white">RED ALLIANCE</h2>
					<div class="text-red-200 font-mono mt-1">{$fieldState.teams.red.join(' & ') || 'No Teams'}</div>
					<div class="text-5xl font-black text-white mt-4">{$fieldState.liveScore.red.total}</div>
				</div>
				<div class="p-6 space-y-6 flex-1">
					{#each [
						{ key: 'teleIndependent', label: 'TeleOp Independent', step: 1 },
						{ key: 'sharedScore', label: 'Shared Score', step: 1 },
						{ key: 'endgame', label: 'Endgame Tasks', step: 5 },
						{ key: 'penalties', label: 'Penalties (Deductions)', step: 5 }
					] as field}
						<div class="flex items-center justify-between">
							<span class="font-semibold text-lg text-red-100">{field.label}</span>
							<div class="flex items-center gap-4">
								<Button variant="outline" size="icon" onclick={() => adjustScore('red', field.key as any, -field.step)} class="h-12 w-12 rounded-full border-red-800 text-red-500 hover:bg-red-900/50">-</Button>
								<span class="text-2xl font-bold w-12 text-center text-white">{$fieldState.liveScore.red[field.key as keyof typeof $fieldState.liveScore.red] || 0}</span>
								<Button variant="outline" size="icon" onclick={() => adjustScore('red', field.key as any, field.step)} class="h-12 w-12 rounded-full border-red-800 text-red-500 hover:bg-red-900/50">+</Button>
							</div>
						</div>
					{/each}
					<div class="pt-4 border-t border-red-900/50">
						<span class="font-semibold text-lg text-red-100 block mb-3">Balance Multiplier</span>
						<div class="flex gap-2">
							{#each [1, 1.5, 2] as mult}
								<Button 
									variant={$fieldState.liveScore.red.balanceMultiplier === mult ? 'default' : 'outline'}
									class={$fieldState.liveScore.red.balanceMultiplier === mult ? 'bg-red-600 hover:bg-red-700 flex-1' : 'border-red-800 text-red-500 hover:bg-red-900/50 flex-1'}
									onclick={() => setMultiplier('red', mult)}
								>
									{mult}x
								</Button>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- BLUE ALLIANCE -->
			<div class="bg-blue-950/20 border-2 border-blue-900 rounded-xl overflow-hidden flex flex-col">
				<div class="bg-blue-900 p-4 text-center">
					<h2 class="text-2xl font-bold text-white">BLUE ALLIANCE</h2>
					<div class="text-blue-200 font-mono mt-1">{$fieldState.teams.blue.join(' & ') || 'No Teams'}</div>
					<div class="text-5xl font-black text-white mt-4">{$fieldState.liveScore.blue.total}</div>
				</div>
				<div class="p-6 space-y-6 flex-1">
					{#each [
						{ key: 'teleIndependent', label: 'TeleOp Independent', step: 1 },
						{ key: 'sharedScore', label: 'Shared Score', step: 1 },
						{ key: 'endgame', label: 'Endgame Tasks', step: 5 },
						{ key: 'penalties', label: 'Penalties (Deductions)', step: 5 }
					] as field}
						<div class="flex items-center justify-between">
							<span class="font-semibold text-lg text-blue-100">{field.label}</span>
							<div class="flex items-center gap-4">
								<Button variant="outline" size="icon" onclick={() => adjustScore('blue', field.key as any, -field.step)} class="h-12 w-12 rounded-full border-blue-800 text-blue-500 hover:bg-blue-900/50">-</Button>
								<span class="text-2xl font-bold w-12 text-center text-white">{$fieldState.liveScore.blue[field.key as keyof typeof $fieldState.liveScore.blue] || 0}</span>
								<Button variant="outline" size="icon" onclick={() => adjustScore('blue', field.key as any, field.step)} class="h-12 w-12 rounded-full border-blue-800 text-blue-500 hover:bg-blue-900/50">+</Button>
							</div>
						</div>
					{/each}
					<div class="pt-4 border-t border-blue-900/50">
						<span class="font-semibold text-lg text-blue-100 block mb-3">Balance Multiplier</span>
						<div class="flex gap-2">
							{#each [1, 1.5, 2] as mult}
								<Button 
									variant={$fieldState.liveScore.blue.balanceMultiplier === mult ? 'default' : 'outline'}
									class={$fieldState.liveScore.blue.balanceMultiplier === mult ? 'bg-blue-600 hover:bg-blue-700 flex-1' : 'border-blue-800 text-blue-500 hover:bg-blue-900/50 flex-1'}
									onclick={() => setMultiplier('blue', mult)}
								>
									{mult}x
								</Button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex justify-end pt-4">
			<Button 
				size="lg" 
				class="bg-green-600 hover:bg-green-700 text-lg px-12 py-6 h-auto"
				disabled={$fieldState.liveScore.status !== 'draft'}
				onclick={() => submitScore(data.fieldId)}
			>
				SUBMIT SCORE TO HEAD REFEREE
			</Button>
		</div>
	{/if}
</div>
