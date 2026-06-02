<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="@container/main flex flex-1 flex-col gap-2">
	<div class="flex flex-col gap-8 py-4 md:gap-10 md:py-6 px-4 md:px-6">
		<div>
			<h1 class="text-4xl font-bold mb-2">Admin Dashboard</h1>
			<p class="text-muted-foreground">Monitor your robotics competition</p>
		</div>

		<!-- Statistics Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
			<div class="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4 backdrop-blur-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-zinc-400 font-medium">Total Teams</p>
						<p class="text-3xl font-bold text-cyan-400 mt-1">{data.stats.totalTeams}</p>
					</div>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-cyan-500/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
					</svg>
				</div>
			</div>

			<div class="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4 backdrop-blur-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-zinc-400 font-medium">Total Matches</p>
						<p class="text-3xl font-bold text-purple-400 mt-1">{data.stats.totalMatches}</p>
					</div>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-purple-500/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
					</svg>
				</div>
			</div>

			<div class="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4 backdrop-blur-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-zinc-400 font-medium">Finished</p>
						<p class="text-3xl font-bold text-green-400 mt-1">{data.stats.finishedMatches}</p>
					</div>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-500/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="20 6 9 17 4 12"/>
					</svg>
				</div>
			</div>

			<div class="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4 backdrop-blur-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-zinc-400 font-medium">Upcoming</p>
						<p class="text-3xl font-bold text-yellow-400 mt-1">{data.stats.upcomingMatches}</p>
					</div>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-yellow-500/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="1"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/>
					</svg>
				</div>
			</div>

			<div class="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4 backdrop-blur-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-zinc-400 font-medium">Fields</p>
						<p class="text-3xl font-bold text-orange-400 mt-1">{data.stats.totalFields}</p>
					</div>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-orange-500/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
					</svg>
				</div>
			</div>

			<div class="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4 backdrop-blur-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-zinc-400 font-medium">Competitions</p>
						<p class="text-lg text-zinc-200 mt-1">Active: <span class="font-bold text-green-400">{data.stats.activeCompetitions}</span></p>
						<p class="text-lg text-zinc-200 mt-1">Upcoming: <span class="font-bold text-yellow-400">{data.stats.upcomingCompetitions}</span></p>
					</div>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-cyan-500/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
					</svg>
				</div>
			</div>
		</div>

		<!-- Navigation Cards -->
		<div>
			<h2 class="text-lg font-semibold text-zinc-100 mb-4">Manage Data</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<a href="/admin/matches" class="block">
					<Button class="w-full h-40 text-lg font-semibold" variant="outline">
						<div class="flex flex-col items-center gap-3">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="12" cy="12" r="1"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/>
							</svg>
							<div>
								<div>Matches</div>
								<div class="text-sm font-normal text-zinc-400">{data.stats.totalMatches} total</div>
							</div>
						</div>
					</Button>
				</a>

				<a href="/admin/competitions" class="block">
					<Button class="w-full h-40 text-lg font-semibold" variant="outline">
						<div class="flex flex-col items-center gap-3">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M3 7h18"/><path d="M7 3v4"/><path d="M17 3v4"/><rect x="3" y="7" width="18" height="14" rx="2" ry="2"/>
							</svg>
							<div>
								<div>Competitions</div>
								<div class="text-sm font-normal text-zinc-400">{data.stats.totalCompetitions} total</div>
							</div>
						</div>
					</Button>
				</a>

				<a href="/admin/teams" class="block">
					<Button class="w-full h-40 text-lg font-semibold" variant="outline">
						<div class="flex flex-col items-center gap-3">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
							</svg>
							<div>
								<div>Teams</div>
								<div class="text-sm font-normal text-zinc-400">{data.stats.totalTeams} teams</div>
							</div>
						</div>
					</Button>
				</a>
			</div>
		</div>
	</div>
</div>
