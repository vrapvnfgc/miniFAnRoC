<script lang="ts">
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

		<div class="grid items-start gap-8 lg:grid-cols-2">
			<!-- Map -->
			<div
				class="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none"
			>
				<div
					class="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/60"
				>
					<svg
						viewBox="0 0 300 600"
						class="h-full max-h-[480px] w-auto"
						xmlns="http://www.w3.org/2000/svg"
						aria-label="Vietnam regional competition map"
					>
						<g
							role="button"
							tabindex="0"
							aria-label="Hanoi region"
							onmouseenter={() => setHover('hanoi')}
							onmouseleave={() => setHover(null)}
							onfocus={() => setHover('hanoi')}
							onblur={() => setHover(null)}
						>
							<rect
								x="60"
								y="20"
								width="160"
								height="140"
								rx="16"
								fill={hoveredRegion === 'hanoi' ? '#0ea5e940' : '#0ea5e920'}
								stroke="#0ea5e950"
								stroke-width="1.5"
								style="cursor:pointer;transition:fill 0.2s"
							/>
							<text
								x="140"
								y="78"
								text-anchor="middle"
								fill="#0369a1"
								font-size="10"
								font-weight="600"
								style="pointer-events:none">Northern VN</text
							>
							<text
								x="140"
								y="94"
								text-anchor="middle"
								fill="#0284c7"
								font-size="9"
								style="pointer-events:none">FSchool Hanoi</text
							>
							<circle
								cx="140"
								cy="115"
								r="5"
								fill="#0ea5e9"
								opacity="0.8"
								style="pointer-events:none"
								><animate
									attributeName="opacity"
									values="0.8;0.3;0.8"
									dur="2s"
									repeatCount="indefinite"
								/></circle
							>
						</g>
						<g
							role="button"
							tabindex="0"
							aria-label="Thanh Hoa region"
							onmouseenter={() => setHover('thanhhoa')}
							onmouseleave={() => setHover(null)}
							onfocus={() => setHover('thanhhoa')}
							onblur={() => setHover(null)}
						>
							<rect
								x="70"
								y="175"
								width="140"
								height="90"
								rx="14"
								fill={hoveredRegion === 'thanhhoa' ? '#f9731640' : '#f9731620'}
								stroke="#f9731650"
								stroke-width="1.5"
								style="cursor:pointer;transition:fill 0.2s"
							/>
							<text
								x="140"
								y="212"
								text-anchor="middle"
								fill="#c2410c"
								font-size="9"
								font-weight="600"
								style="pointer-events:none">Thanh Hoa · Nghe An</text
							>
							<text
								x="140"
								y="226"
								text-anchor="middle"
								fill="#ea580c"
								font-size="8"
								style="pointer-events:none">FSchool Thanh Hoa</text
							>
							<circle
								cx="140"
								cy="244"
								r="4"
								fill="#f97316"
								opacity="0.8"
								style="pointer-events:none"
								><animate
									attributeName="opacity"
									values="0.8;0.3;0.8"
									dur="2.2s"
									repeatCount="indefinite"
								/></circle
							>
						</g>
						<g
							role="button"
							tabindex="0"
							aria-label="Da Nang region"
							onmouseenter={() => setHover('danang')}
							onmouseleave={() => setHover(null)}
							onfocus={() => setHover('danang')}
							onblur={() => setHover(null)}
						>
							<rect
								x="65"
								y="280"
								width="150"
								height="110"
								rx="14"
								fill={hoveredRegion === 'danang' ? '#a855f740' : '#a855f720'}
								stroke="#a855f750"
								stroke-width="1.5"
								style="cursor:pointer;transition:fill 0.2s"
							/>
							<text
								x="140"
								y="325"
								text-anchor="middle"
								fill="#7e22ce"
								font-size="9"
								font-weight="600"
								style="pointer-events:none">Central Vietnam</text
							>
							<text
								x="140"
								y="340"
								text-anchor="middle"
								fill="#9333ea"
								font-size="8"
								style="pointer-events:none">FSchool Da Nang</text
							>
							<circle
								cx="140"
								cy="358"
								r="4"
								fill="#a855f7"
								opacity="0.8"
								style="pointer-events:none"
								><animate
									attributeName="opacity"
									values="0.8;0.3;0.8"
									dur="1.8s"
									repeatCount="indefinite"
								/></circle
							>
						</g>
						<g
							role="button"
							tabindex="0"
							aria-label="Can Tho region"
							onmouseenter={() => setHover('cantho')}
							onmouseleave={() => setHover(null)}
							onfocus={() => setHover('cantho')}
							onblur={() => setHover(null)}
						>
							<rect
								x="55"
								y="410"
								width="170"
								height="140"
								rx="16"
								fill={hoveredRegion === 'cantho' ? '#22c55e40' : '#22c55e20'}
								stroke="#22c55e50"
								stroke-width="1.5"
								style="cursor:pointer;transition:fill 0.2s"
							/>
							<text
								x="140"
								y="470"
								text-anchor="middle"
								fill="#15803d"
								font-size="10"
								font-weight="600"
								style="pointer-events:none">Southern VN</text
							>
							<text
								x="140"
								y="486"
								text-anchor="middle"
								fill="#16a34a"
								font-size="9"
								style="pointer-events:none">FSchool Can Tho</text
							>
							<circle
								cx="140"
								cy="508"
								r="5"
								fill="#22c55e"
								opacity="0.8"
								style="pointer-events:none"
								><animate
									attributeName="opacity"
									values="0.8;0.3;0.8"
									dur="2.5s"
									repeatCount="indefinite"
								/></circle
							>
						</g>
						<text x="140" y="578" text-anchor="middle" fill="#94a3b8" font-size="8"
							>{m.map_placeholder()}</text
						>
					</svg>

					{#if hoveredRegion}
						{@const region = regions.find((r) => r.id === hoveredRegion)}
						{#if region}
							<div
								class="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 rounded-xl border border-slate-200 bg-white/95 px-4 py-2 text-center text-sm shadow-lg backdrop-blur-sm dark:border-white/15 dark:bg-slate-950/90"
							>
								<p class="font-semibold {region.labelClass}">{region.venue}</p>
								<p class="text-xs text-slate-500 dark:text-slate-400">{region.tooltip}</p>
							</div>
						{/if}
					{/if}
				</div>
			</div>

			<!-- Legend cards -->
			<div class="space-y-4">
				{#each regions as r}
					<button
						class="w-full rounded-[24px] border text-left {r.bgClass} p-6 transition duration-200 hover:-translate-x-1 hover:shadow-md focus:outline-none dark:hover:shadow-none"
						style={hoveredRegion === r.id ? `box-shadow:0 0 0 2px ${r.color}40` : ''}
						onmouseenter={() => setHover(r.id)}
						onmouseleave={() => setHover(null)}
					>
						<div class="flex items-start justify-between gap-4">
							<div>
								<h3 class="mb-1 text-lg font-bold {r.labelClass}">{r.name}</h3>
								<p class="text-sm text-slate-500 dark:text-slate-400">{r.subtitle}</p>
							</div>
							<div
								class="mt-1.5 h-3 w-3 shrink-0 rounded-full"
								style="background:{r.color}; box-shadow:0 0 10px {r.color}80"
							></div>
						</div>
						<p class="mt-3 text-sm text-slate-500 dark:text-slate-500">{r.tooltip}</p>
					</button>
				{/each}
			</div>
		</div>
	</div>
</section>
