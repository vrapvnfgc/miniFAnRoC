<script lang="ts">
	import { ArrowDown } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';

	let hoveredRegion = $state<string | null>(null);

	const regions = [
		{
			id: 'hanoi',
			name: m.map_region_hanoi_name(),
			subtitle: m.map_region_hanoi_subtitle(),
			venue: m.map_region_hanoi_venue(),
			color: '#0ea5e9',
			bgClass: 'border-blue-500/25 bg-blue-50 dark:bg-blue-500/10',
			labelClass: 'text-blue-700 dark:text-blue-300',
			tooltip: m.map_region_hanoi_tooltip()
		},
		{
			id: 'thanhhoa',
			name: m.map_region_thanhhoa_name(),
			subtitle: m.map_region_thanhhoa_subtitle(),
			venue: m.map_region_thanhhoa_venue(),
			color: '#f97316',
			bgClass: 'border-orange-500/25 bg-orange-50 dark:bg-orange-500/10',
			labelClass: 'text-orange-700 dark:text-orange-300',
			tooltip: m.map_region_thanhhoa_tooltip()
		},
		{
			id: 'danang',
			name: m.map_region_danang_name(),
			subtitle: m.map_region_danang_subtitle(),
			venue: m.map_region_danang_venue(),
			color: '#a855f7',
			bgClass: 'border-purple-500/25 bg-purple-50 dark:bg-purple-500/10',
			labelClass: 'text-purple-700 dark:text-purple-300',
			tooltip: m.map_region_danang_tooltip()
		},
		{
			id: 'cantho',
			name: m.map_region_cantho_name(),
			subtitle: m.map_region_cantho_subtitle(),
			venue: m.map_region_cantho_venue(),
			color: '#22c55e',
			bgClass: 'border-green-500/25 bg-green-50 dark:bg-green-500/10',
			labelClass: 'text-green-700 dark:text-green-300',
			tooltip: m.map_region_cantho_tooltip()
		}
	];

	const finalRound = {
		title: m.map_finals_title(),
		venue: m.map_finals_venue(),
		description: m.map_finals_desc()
	};

	function setHover(id: string | null) {
		hoveredRegion = id;
	}
</script>

<section class="bg-slate-50 px-6 py-28 dark:bg-slate-900/40">
	<div class="mx-auto max-w-7xl">
		<div class="mb-14 text-center">
			<p
				class="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400"
			>
				{m.map_label()}
			</p>
			<h2 class="text-4xl font-black text-slate-900 dark:text-white">{m.map_title()}</h2>
			<p class="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
				{m.map_desc()}
			</p>
		</div>

		<div>
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{#each regions as r}
					<button
						class="min-h-48 rounded-3xl border text-left {r.bgClass} p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 dark:hover:shadow-none"
						style={hoveredRegion === r.id ? `box-shadow:0 0 0 2px ${r.color}40` : ''}
						onmouseenter={() => setHover(r.id)}
						onmouseleave={() => setHover(null)}
						onfocus={() => setHover(r.id)}
						onblur={() => setHover(null)}
					>
						<div class="mb-5 flex items-start justify-between gap-4">
							<div
								class="h-3 w-3 shrink-0 rounded-full"
								style="background:{r.color}; box-shadow:0 0 12px {r.color}80"
							></div>
							<span
								class="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-300"
							>
								{r.venue}
							</span>
						</div>
						<h3 class="mb-2 text-xl font-black {r.labelClass}">{r.name}</h3>
						<p class="text-sm leading-6 text-slate-600 dark:text-slate-300">{r.subtitle}</p>
						<p class="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">{r.tooltip}</p>
					</button>
				{/each}
			</div>

			<div class="flex justify-center py-8" aria-hidden="true">
				<div
					class="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/20 bg-white text-cyan-600 shadow-sm dark:bg-slate-950 dark:text-cyan-300"
				>
					<ArrowDown class="h-8 w-8" strokeWidth={2.4} />
				</div>
			</div>

			<div
				class="mx-auto max-w-3xl rounded-3xl border border-cyan-500/25 bg-cyan-50 p-7 text-center shadow-sm dark:bg-cyan-500/10"
			>
				<p
					class="mb-2 text-xs font-semibold tracking-[0.2em] text-cyan-700 uppercase dark:text-cyan-300"
				>
					{finalRound.title}
				</p>
				<h3 class="text-2xl font-black text-slate-900 dark:text-white">{finalRound.venue}</h3>
				<p class="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
					{finalRound.description}
				</p>
			</div>
		</div>
	</div>
</section>
