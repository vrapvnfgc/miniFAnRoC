<script lang="ts">
	import { teamStore, type Team } from '$lib/stores/teams';
	import { Trophy, TrendingUp, Zap, Star, Medal } from 'lucide-svelte';

	let teams = $state<Team[]>([]);
	const unsubTeams = teamStore.teams.subscribe((v) => { teams = v; });

	// Rankings sorted by score desc
	const rankings = $derived(
		[...teams]
			.sort((a, b) => b.score - a.score)
			.map((t, i) => ({ ...t, rank: i + 1 }))
	);

	const topThree = $derived(rankings.slice(0, 3));
	const rest = $derived(rankings.slice(3));

	const maxScore = $derived(rankings[0]?.score ?? 1);

	function podiumHeight(rank: number) {
		if (rank === 1) return 'h-28 sm:h-36';
		if (rank === 2) return 'h-20 sm:h-28';
		return 'h-14 sm:h-20';
	}

	function podiumGrad(rank: number) {
		if (rank === 1) return 'from-yellow-400 via-amber-400 to-yellow-500';
		if (rank === 2) return 'from-slate-300 via-slate-200 to-slate-300';
		return 'from-amber-600 via-orange-600 to-amber-700';
	}

	function podiumText(rank: number) {
		if (rank === 1) return 'text-yellow-400';
		if (rank === 2) return 'text-slate-300';
		return 'text-amber-600';
	}

	function podiumOrder(idx: number) {
		// Render as: 2nd | 1st | 3rd
		const order = [1, 0, 2];
		return order[idx];
	}

	function rankColor(rank: number) {
		if (rank === 1) return 'text-yellow-400';
		if (rank === 2) return 'text-slate-300';
		if (rank === 3) return 'text-amber-600';
		return 'text-slate-500';
	}

	function scoreBar(score: number) {
		return Math.round((score / maxScore) * 100);
	}
</script>

<svelte:head>
	<title>Ranking — miniFAnRoC</title>
</svelte:head>

<div class="flex flex-col gap-10">

	<!-- Section title -->
	<div class="flex items-center gap-3">
		<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30">
			<Trophy class="h-5 w-5 text-black" />
		</div>
		<div>
			<h2 class="text-xl font-bold text-white">Bảng Xếp Hạng</h2>
			<p class="text-xs text-slate-500">{rankings.length} đội · Cập nhật theo thời gian thực</p>
		</div>
	</div>

	<!-- Podium (top 3) -->
	{#if topThree.length >= 3}
		<div class="flex items-end justify-center gap-4 py-4">
			{#each [topThree[1], topThree[0], topThree[2]] as team, i}
				{@const isFirst = team.rank === 1}
				<div class="flex flex-col items-center gap-3" style="order: {i}">
					<!-- Crown for 1st -->
					{#if isFirst}
						<div class="text-2xl animate-bounce">👑</div>
					{/if}

					<!-- Avatar + name -->
					<div class="flex flex-col items-center gap-1.5 text-center">
						<div class="relative h-14 w-14 {isFirst ? 'h-16 w-16' : ''}">
							<div class="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br {podiumGrad(team.rank)} text-lg font-bold text-black shadow-lg ring-2 ring-white/20">
								{team.name.charAt(0)}
							</div>
						</div>
						<p class="max-w-[90px] text-xs font-semibold leading-tight text-white {isFirst ? 'text-sm' : ''}">{team.name}</p>
						<p class="font-bold {podiumText(team.rank)} {isFirst ? 'text-lg' : 'text-base'}">{team.score.toLocaleString()}</p>
					</div>

					<!-- Podium block -->
					<div class="flex w-20 sm:w-24 {podiumHeight(team.rank)} items-center justify-center rounded-t-xl bg-gradient-to-b {podiumGrad(team.rank)} shadow-lg {isFirst ? 'shadow-yellow-500/30' : ''}">
						<span class="text-2xl font-black text-black/70">#{team.rank}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Full ranking table -->
	<div>
		<h3 class="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">Toàn Bộ Bảng Xếp Hạng</h3>

		<!-- Desktop table -->
		<div class="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm md:block">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
						<th class="px-5 py-4 text-left">Hạng</th>
						<th class="px-5 py-4 text-left">Đội</th>
						<th class="px-5 py-4 text-left">Đội Trưởng</th>
						<th class="px-5 py-4 text-left">Thành Viên</th>
						<th class="px-5 py-4 text-right">Điểm</th>
						<th class="px-5 py-4 text-left w-40">Tiến Độ</th>
					</tr>
				</thead>
				<tbody>
					{#each rankings as team, i (team.id)}
						<tr class="border-b border-white/5 transition-all hover:bg-white/5"
							class:bg-gradient-to-r={team.rank <= 3}
							class:from-yellow-500/5={team.rank === 1}
							class:from-slate-400/5={team.rank === 2}
							class:from-amber-700/5={team.rank === 3}
						>
							<td class="px-5 py-4">
								<div class="flex items-center gap-2">
									{#if team.rank === 1}
										<Trophy class="h-4 w-4 text-yellow-400" />
									{:else if team.rank === 2}
										<Medal class="h-4 w-4 text-slate-300" />
									{:else if team.rank === 3}
										<Star class="h-4 w-4 text-amber-600" />
									{/if}
									<span class="font-bold {rankColor(team.rank)} text-base">#{team.rank}</span>
								</div>
							</td>
							<td class="px-5 py-4 font-semibold text-white">{team.name}</td>
							<td class="px-5 py-4 text-slate-400">{team.captainName}</td>
							<td class="px-5 py-4 text-slate-400">{team.memberCount} người</td>
							<td class="px-5 py-4 text-right font-bold text-cyan-400 tabular-nums">{team.score.toLocaleString()}</td>
							<td class="px-5 py-4">
								<div class="flex items-center gap-2">
									<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
										<div
											class="h-full rounded-full transition-all duration-500
												{team.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
												 team.rank === 2 ? 'bg-gradient-to-r from-slate-300 to-slate-400' :
												 team.rank === 3 ? 'bg-gradient-to-r from-amber-600 to-orange-600' :
												 'bg-gradient-to-r from-cyan-500 to-blue-500'}"
											style="width: {scoreBar(team.score)}%"
										></div>
									</div>
									<span class="w-8 text-right text-xs text-slate-500">{scoreBar(team.score)}%</span>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="px-5 py-16 text-center text-slate-500">Chưa có dữ liệu xếp hạng</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Mobile cards -->
		<div class="flex flex-col gap-3 md:hidden">
			{#each rankings as team (team.id)}
				<div class="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
					class:border-yellow-500/30={team.rank === 1}>
					<span class="text-lg font-bold {rankColor(team.rank)} w-8 text-center">#{team.rank}</span>
					<div class="flex-1 min-w-0">
						<p class="font-semibold text-white truncate">{team.name}</p>
						<div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
							<div class="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style="width: {scoreBar(team.score)}%"></div>
						</div>
					</div>
					<span class="font-bold text-cyan-400 tabular-nums shrink-0">{team.score.toLocaleString()}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Legend -->
	<div class="flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-500">
		<div class="flex items-center gap-2"><Trophy class="h-3.5 w-3.5 text-yellow-400" /> Vô địch</div>
		<div class="flex items-center gap-2"><Medal class="h-3.5 w-3.5 text-slate-300" /> Á quân</div>
		<div class="flex items-center gap-2"><Star class="h-3.5 w-3.5 text-amber-600" /> Hạng Ba</div>
		<div class="flex items-center gap-2"><TrendingUp class="h-3.5 w-3.5 text-cyan-400" /> Điểm từ các trận đấu đã hoàn thành</div>
		<div class="flex items-center gap-2"><Zap class="h-3.5 w-3.5 text-violet-400" /> Cập nhật sau mỗi trận đấu</div>
	</div>
</div>
