<script lang="ts">
	import { matchStore, type Match, type MatchPhase } from '$lib/stores/matches';
	import { Calendar, Clock, Zap, CheckCircle, Circle, PlayCircle, XCircle, Filter } from 'lucide-svelte';

	let matches = $state<Match[]>([]);
	const unsubMatches = matchStore.matches.subscribe((v) => { matches = v; });

	let filterPhase = $state<MatchPhase | 'all'>('all');
	let filterStatus = $state<'all' | 'finished' | 'live' | 'upcoming'>('all');

	const filtered = $derived(
		matches.filter((m) => {
			if (filterPhase !== 'all' && m.phase !== filterPhase) return false;
			if (filterStatus === 'finished' && m.status !== 'finished') return false;
			if (filterStatus === 'live' && m.status !== 'in_progress') return false;
			if (filterStatus === 'upcoming' && m.status !== 'scheduled' && m.status !== 'queued') return false;
			return true;
		})
	);

	// Group by phase
	const grouped = $derived(
		filtered.reduce<Record<string, Match[]>>((acc, m) => {
			acc[m.phase] = [...(acc[m.phase] ?? []), m];
			return acc;
		}, {})
	);

	const phaseOrder: MatchPhase[] = ['qualification', 'semifinal', 'final'];
	const phaseLabel: Record<MatchPhase, string> = {
		qualification: 'Vòng Loại',
		semifinal: 'Bán Kết',
		final: 'Chung Kết'
	};
	const phaseColor: Record<MatchPhase, string> = {
		qualification: 'from-blue-500 to-cyan-500',
		semifinal: 'from-violet-500 to-purple-600',
		final: 'from-yellow-400 to-amber-500'
	};

	function statusIcon(status: string) {
		if (status === 'finished') return CheckCircle;
		if (status === 'in_progress') return PlayCircle;
		if (status === 'terminated') return XCircle;
		return Circle;
	}

	function statusColor(status: string) {
		if (status === 'finished') return 'text-emerald-400';
		if (status === 'in_progress') return 'text-yellow-400 animate-pulse';
		if (status === 'terminated') return 'text-rose-400';
		return 'text-slate-500';
	}

	function statusLabel(status: string) {
		if (status === 'finished') return 'Kết thúc';
		if (status === 'in_progress') return 'Đang diễn ra';
		if (status === 'queued') return 'Chờ';
		if (status === 'scheduled') return 'Đã lên lịch';
		if (status === 'terminated') return 'Hủy';
		return status;
	}

	function formatTime(iso?: string) {
		if (!iso) return '—';
		const d = new Date(iso);
		return d.toLocaleString('vi-VN', {
			day: '2-digit', month: '2-digit', year: 'numeric',
			hour: '2-digit', minute: '2-digit'
		});
	}

	const liveCount = $derived(matches.filter((m) => m.status === 'in_progress').length);
</script>

<svelte:head>
	<title>Match Schedule — miniFAnRoC</title>
</svelte:head>

<div class="flex flex-col gap-8">

	<!-- Header + live indicator -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center gap-3">
			<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
				<Calendar class="h-5 w-5 text-white" />
			</div>
			<div>
				<h2 class="text-xl font-bold text-white">Lịch Trình Trận Đấu</h2>
				<p class="text-xs text-slate-500">{matches.length} trận đấu tổng cộng</p>
			</div>
			{#if liveCount > 0}
				<span class="flex items-center gap-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 text-xs font-semibold text-yellow-400">
					<span class="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
					{liveCount} LIVE
				</span>
			{/if}
		</div>

		<!-- Filters -->
		<div class="flex flex-wrap gap-2">
			<div class="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
				{#each [
					{ v: 'all', label: 'Tất Cả' },
					{ v: 'finished', label: 'Kết Thúc' },
					{ v: 'live', label: 'LIVE' },
					{ v: 'upcoming', label: 'Sắp Tới' }
				] as f}
					<button
						onclick={() => filterStatus = f.v as typeof filterStatus}
						class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all
							{filterStatus === f.v
								? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
								: 'text-slate-400 hover:text-white'}"
					>{f.label}</button>
				{/each}
			</div>
			<div class="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
				{#each [
					{ v: 'all', label: 'Tất Cả Vòng' },
					{ v: 'qualification', label: 'Vòng Loại' },
					{ v: 'semifinal', label: 'Bán Kết' },
					{ v: 'final', label: 'Chung Kết' }
				] as f}
					<button
						onclick={() => filterPhase = f.v as typeof filterPhase}
						class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all
							{filterPhase === f.v
								? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow'
								: 'text-slate-400 hover:text-white'}"
					>{f.label}</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Grouped match list -->
	{#each phaseOrder as phase}
		{#if grouped[phase]?.length}
			<div class="flex flex-col gap-4">
				<!-- Phase header -->
				<div class="flex items-center gap-3">
					<div class="h-0.5 w-6 rounded-full bg-gradient-to-r {phaseColor[phase]}"></div>
					<h3 class="font-bold text-white">{phaseLabel[phase]}</h3>
					<span class="text-xs text-slate-500">{grouped[phase].length} trận</span>
					<div class="flex-1 h-px bg-white/5"></div>
				</div>

				<!-- Match cards -->
				<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{#each grouped[phase] as match (match.id)}
						{@const isLive = match.status === 'in_progress'}
						{@const isDone = match.status === 'finished'}
						<div
							class="relative overflow-hidden rounded-2xl border p-4 backdrop-blur-sm transition-all
								{isLive
									? 'border-yellow-400/30 bg-yellow-400/5 shadow-lg shadow-yellow-400/10'
									: isDone
										? 'border-white/10 bg-white/5'
										: 'border-white/10 bg-white/5 hover:border-cyan-500/30'}"
						>
							<!-- Live glow strip -->
							{#if isLive}
								<div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500"></div>
							{:else if isDone}
								<div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r {phaseColor[phase]} opacity-50"></div>
							{/if}

							<!-- Match header -->
							<div class="mb-3 flex items-center justify-between">
								<span class="text-xs font-bold uppercase tracking-widest text-slate-500">
									Trận #{match.matchNumber} · {phaseLabel[phase]}
								</span>
								<span class="flex items-center gap-1 text-xs {statusColor(match.status)}">
									<svelte:component this={statusIcon(match.status)} class="h-3.5 w-3.5" />
									{statusLabel(match.status)}
								</span>
							</div>

							<!-- Alliance matchup -->
							<div class="flex items-center gap-2">
								<!-- Red alliance -->
								<div class="flex-1 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
									<p class="mb-1 text-[10px] font-semibold uppercase tracking-widest text-red-400">Đỏ</p>
									{#each match.redTeams as t}
										<p class="text-xs font-medium text-white leading-snug">{t.name}</p>
										<p class="text-[10px] text-slate-500">{t.number}</p>
									{/each}
									{#if isDone && match.score}
										<p class="mt-2 text-lg font-black {match.winner === 'red' ? 'text-red-300' : 'text-slate-500'}">{match.score.red}</p>
									{/if}
								</div>

								<!-- VS divider -->
								<div class="flex flex-col items-center gap-1">
									<span class="text-xs font-bold text-slate-500">VS</span>
									{#if isDone && match.winner}
										<span class="text-xs">
											{match.winner === 'red' ? '←' : match.winner === 'blue' ? '→' : '='}
										</span>
									{/if}
								</div>

								<!-- Blue alliance -->
								<div class="flex-1 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
									<p class="mb-1 text-[10px] font-semibold uppercase tracking-widest text-blue-400">Xanh</p>
									{#each match.blueTeams as t}
										<p class="text-xs font-medium text-white leading-snug">{t.name}</p>
										<p class="text-[10px] text-slate-500">{t.number}</p>
									{/each}
									{#if isDone && match.score}
										<p class="mt-2 text-lg font-black {match.winner === 'blue' ? 'text-blue-300' : 'text-slate-500'}">{match.score.blue}</p>
									{/if}
								</div>
							</div>

							<!-- Footer: time + field -->
							<div class="mt-3 flex items-center gap-3 border-t border-white/10 pt-3 text-[10px] text-slate-500">
								<Clock class="h-3 w-3 shrink-0" />
								<span>{formatTime(match.scheduledTime)}</span>
								<span class="ml-auto font-mono">{match.fieldId}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/each}

	{#if filtered.length === 0}
		<div class="flex flex-col items-center gap-4 py-24 text-slate-500">
			<Calendar class="h-12 w-12 opacity-30" />
			<p class="text-sm">Không có trận đấu nào phù hợp bộ lọc</p>
		</div>
	{/if}
</div>
