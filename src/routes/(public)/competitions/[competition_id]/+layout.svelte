<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Bot, Users, Trophy, Calendar, UserPlus } from 'lucide-svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children } = $props();

	const competitionId = $derived(page.params.competition_id);
	const currentPath = $derived(page.url.pathname);

	const tabs = $derived([
		{
			id: 'teams',
			label: 'Danh Sách Đội',
			labelEn: 'Team List',
			href: `/competitions/${competitionId}/teams`,
			icon: Users
		},
		{
			id: 'ranking',
			label: 'Bảng Xếp Hạng',
			labelEn: 'Ranking',
			href: `/competitions/${competitionId}/ranking`,
			icon: Trophy
		},
		{
			id: 'schedule',
			label: 'Lịch Trình',
			labelEn: 'Schedule',
			href: `/competitions/${competitionId}/schedule`,
			icon: Calendar
		},
		{
			id: 'register',
			label: 'Đăng Ký Đội',
			labelEn: 'Register',
			href: `/competitions/${competitionId}/register`,
			icon: UserPlus
		}
	]);

	const activeTab = $derived(
		tabs.find((t) => currentPath.endsWith(t.id)) ?? tabs[0]
	);
</script>

<div class="min-h-screen overflow-x-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
	<Navbar />

	<!-- Hero header strip -->
	<div class="relative overflow-hidden pt-20">
		<div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"></div>
		<!-- Subtle grid -->
		<div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px); background-size: 48px 48px;"></div>
		<!-- Glow blobs -->
		<div class="absolute top-0 left-1/4 h-40 w-96 rounded-full bg-cyan-500/20 blur-3xl"></div>
		<div class="absolute top-0 right-1/4 h-40 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

		<div class="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
			<div class="flex items-center gap-3 mb-2">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
					<Bot class="h-4 w-4 text-white" />
				</div>
				<span class="text-xs font-semibold uppercase tracking-widest text-cyan-400">miniFAnRoC Platform</span>
			</div>
			<h1 class="text-2xl font-bold text-white sm:text-3xl">FSchool AI & Robotics Challenge</h1>
			<p class="mt-1 text-sm text-slate-400">Competition ID: <span class="font-mono text-cyan-400">{competitionId}</span></p>
		</div>

		<!-- Tab bar -->
		<div class="relative border-b border-white/10">
			<div class="mx-auto max-w-7xl px-4 sm:px-6">
				<div class="flex gap-1 overflow-x-auto pb-0 scrollbar-none">
					{#each tabs as tab}
						{@const isActive = currentPath.endsWith(tab.id)}
						<a
							href={tab.href}
							class="group relative flex shrink-0 items-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors duration-200
								{isActive
									? 'text-cyan-400'
									: 'text-slate-400 hover:text-slate-200'}"
						>
							<svelte:component this={tab.icon} class="h-4 w-4 shrink-0" />
							<span class="hidden sm:inline">{tab.label}</span>
							<span class="sm:hidden">{tab.labelEn}</span>
							{#if isActive}
								<span class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-full"></span>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Tab content -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
		{@render children()}
	</main>

	<Footer />
</div>

<style>
	.scrollbar-none::-webkit-scrollbar { display: none; }
	.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
</style>
