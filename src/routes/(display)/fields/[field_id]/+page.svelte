<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { connectToField, disconnectFromField, fieldState, isConnected } from '$lib/stores/socket';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		connectToField(data.fieldId);
	});

	onDestroy(() => {
		disconnectFromField();
	});

	function formatTime(seconds: number) {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}
</script>

<div class="h-screen w-screen bg-black text-white flex flex-col overflow-hidden">
	<!-- HEADER -->
	<header class="bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center h-24">
		<div class="flex items-center gap-4">
			<img src="/logo.png" alt="Logo" class="h-12 w-12 object-contain" onerror={(e) => e.currentTarget.style.display='none'} />
			<h1 class="text-3xl font-black tracking-widest uppercase">Field {data.fieldId}</h1>
		</div>
		<div class="flex flex-col items-center">
			<div class="text-sm font-bold text-zinc-500 tracking-widest uppercase">{$fieldState?.status || 'OFFLINE'}</div>
			<div class="text-5xl font-mono font-bold text-yellow-400 tabular-nums">
				{$fieldState ? formatTime($fieldState.timer) : '0:00'}
			</div>
		</div>
		<div class="w-48 text-right">
			{#if $fieldState?.liveScore.status === 'finalized'}
				<span class="inline-block bg-green-600 text-white font-bold px-4 py-2 rounded uppercase tracking-wider">Final</span>
			{:else if $fieldState?.liveScore.status === 'submitted'}
				<span class="inline-block bg-yellow-600 text-white font-bold px-4 py-2 rounded uppercase tracking-wider">Under Review</span>
			{/if}
		</div>
	</header>

	<!-- MAIN CONTENT -->
	<main class="flex-1 flex p-6 gap-6">
		{#if $fieldState}
			<!-- MATCH INFO -->
			<div class="flex-1 flex flex-col gap-6">
				<!-- RED ALLIANCE -->
				<div class="flex-1 bg-gradient-to-br from-red-900/40 to-black border border-red-900 rounded-3xl flex overflow-hidden">
					<div class="w-1/3 bg-red-950 p-8 flex flex-col justify-center">
						<h2 class="text-4xl font-black text-red-500 mb-6">RED<br/>ALLIANCE</h2>
						<div class="space-y-4">
							{#each $fieldState.teams.red as team}
								<div class="text-3xl font-mono font-bold text-white">{team}</div>
							{/each}
						</div>
					</div>
					<div class="flex-1 flex items-center justify-center relative">
						<div class="text-[12rem] font-black text-white leading-none">
							{$fieldState.liveScore.red.total}
						</div>
					</div>
				</div>

				<!-- BLUE ALLIANCE -->
				<div class="flex-1 bg-gradient-to-br from-blue-900/40 to-black border border-blue-900 rounded-3xl flex overflow-hidden">
					<div class="w-1/3 bg-blue-950 p-8 flex flex-col justify-center">
						<h2 class="text-4xl font-black text-blue-500 mb-6">BLUE<br/>ALLIANCE</h2>
						<div class="space-y-4">
							{#each $fieldState.teams.blue as team}
								<div class="text-3xl font-mono font-bold text-white">{team}</div>
							{/each}
						</div>
					</div>
					<div class="flex-1 flex items-center justify-center relative">
						<div class="text-[12rem] font-black text-white leading-none">
							{$fieldState.liveScore.blue.total}
						</div>
					</div>
				</div>
			</div>

			<!-- LEADERBOARD SIDEBAR -->
			<div class="w-96 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col overflow-hidden">
				<div class="bg-zinc-800 p-4 text-center font-bold text-xl tracking-widest text-zinc-300 uppercase">
					Live Rankings
				</div>
				<div class="flex-1 overflow-y-auto p-4 space-y-2">
					{#each data.rankings.slice(0, 10) as rank}
						<div class="flex items-center gap-4 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
							<div class="text-2xl font-black text-cyan-500 w-8 text-center">{rank.rank}</div>
							<div class="flex-1">
								<div class="font-bold text-white">{rank.teamNumber}</div>
								<div class="text-xs text-zinc-500 truncate w-32">{rank.teamName}</div>
							</div>
							<div class="text-xl font-mono font-bold text-green-400 text-right">
								{rank.rankingScore.toFixed(1)}
							</div>
						</div>
					{/each}
					{#if data.rankings.length === 0}
						<div class="text-center text-zinc-500 italic mt-8">No rankings available</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="flex-1 flex items-center justify-center">
				<div class="text-4xl text-zinc-600 font-bold tracking-widest">CONNECTING...</div>
			</div>
		{/if}
	</main>
</div>
