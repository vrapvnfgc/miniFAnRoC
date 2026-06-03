<script lang="ts">
	import { goto } from '$app/navigation';
	import { Bot, ArrowRight, Calendar, Users, Trophy, Zap } from 'lucide-svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	// Demo competition list (fake data for local testing)
	const competitions = [
		{
			id: 'fanroc-2025',
			name: 'FAnRoC National 2025',
			description: 'Cuộc thi AI & Robotics toàn quốc dành cho học sinh THCS Việt Nam.',
			status: 'active',
			startDate: '2025-03-15',
			endDate: '2025-04-20',
			teamsCount: 8,
			matchesCount: 8
		},
		{
			id: 'fanroc-2024',
			name: 'FAnRoC Regional 2024',
			description: 'Vòng loại khu vực miền Bắc — FSchool Hà Nội.',
			status: 'completed',
			startDate: '2024-10-01',
			endDate: '2024-10-15',
			teamsCount: 16,
			matchesCount: 24
		}
	];

	function statusColor(status: string) {
		if (status === 'active') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
		if (status === 'upcoming') return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
		return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
	}

	function statusLabel(status: string) {
		if (status === 'active') return 'Đang diễn ra';
		if (status === 'upcoming') return 'Sắp tới';
		return 'Đã kết thúc';
	}
</script>

<svelte:head>
	<title>Competitions — miniFAnRoC</title>
</svelte:head>

<div class="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
	<Navbar />

	<!-- Hero -->
	<div class="relative overflow-hidden pt-24 pb-12">
		<div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"></div>
		<div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px); background-size: 48px 48px;"></div>
		<div class="absolute top-0 left-1/3 h-40 w-96 rounded-full bg-cyan-500/20 blur-3xl"></div>
		<div class="relative mx-auto max-w-7xl px-4 sm:px-6">
			<span class="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-4">
				<Zap class="h-3.5 w-3.5" /> miniFAnRoC Platform
			</span>
			<h1 class="text-3xl font-bold text-white sm:text-4xl">Các Cuộc Thi</h1>
			<p class="mt-2 text-slate-400">Chọn cuộc thi để xem chi tiết, bảng xếp hạng và lịch trình</p>
		</div>
	</div>

	<main class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
		<div class="grid gap-6 sm:grid-cols-2">
			{#each competitions as comp}
				<a
					href="/competitions/{comp.id}/teams"
					class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10 dark:bg-white/5"
				>
					<div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 transition group-hover:opacity-100"></div>

					<div class="mb-4 flex items-start justify-between">
						<div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
							<Bot class="h-5 w-5 text-white" />
						</div>
						<span class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium {statusColor(comp.status)}">
							{statusLabel(comp.status)}
						</span>
					</div>

					<h2 class="text-lg font-bold text-white">{comp.name}</h2>
					<p class="mt-1 text-sm text-slate-400 leading-relaxed">{comp.description}</p>

					<div class="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
						<span class="flex items-center gap-1.5"><Users class="h-4 w-4" /> {comp.teamsCount} đội</span>
						<span class="flex items-center gap-1.5"><Trophy class="h-4 w-4" /> {comp.matchesCount} trận</span>
						<span class="flex items-center gap-1.5"><Calendar class="h-4 w-4" /> {comp.startDate}</span>
					</div>

					<div class="mt-5 flex items-center gap-2 text-sm font-semibold text-cyan-400 transition group-hover:gap-3">
						Xem Chi Tiết <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</div>
				</a>
			{/each}
		</div>
	</main>

	<Footer />
</div>
