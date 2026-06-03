<script lang="ts">
	import { Bot, ArrowRight, ChevronDown } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<section class="relative flex min-h-screen items-center overflow-hidden px-6">
	<!-- Background: dark keeps gradient glow, light uses subtle version -->
	<div class="absolute inset-0">
		<div
			class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.15),transparent)] opacity-40 dark:opacity-100"
		></div>
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.10),transparent_50%)] opacity-30 dark:opacity-100"
		></div>
		<!-- Grid lines: very subtle in light mode -->
		<div
			class="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:72px_72px] dark:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px)]"
		></div>
		<div
			class="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-cyan-500/10 blur-[80px] dark:bg-cyan-500/10"
		></div>
		<div
			class="absolute right-1/4 bottom-1/4 h-64 w-64 animate-pulse rounded-full bg-purple-500/10 blur-[80px] dark:bg-purple-500/10"
			style="animation-delay:1.5s"
		></div>
	</div>

	<div
		class="relative z-10 mx-auto grid max-w-7xl items-center gap-12 pt-20 lg:grid-cols-2 lg:gap-20"
	>
		<div class="order-2 lg:order-1">
			<div
				class="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-700 backdrop-blur-sm dark:text-cyan-300"
			>
				<div class="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500 dark:bg-cyan-400"></div>
				{m.hero_badge()}
			</div>

			<h1 class="text-5xl leading-[1.05] font-black tracking-tight md:text-6xl xl:text-7xl">
				<span class="text-slate-900 dark:text-white">FSchool AI and</span><br />
				<span
					class="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400"
				>
					Robotics Challenge
				</span>
			</h1>

			<p class="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
				{m.hero_subtitle()}
			</p>
			<p class="mt-3 max-w-xl text-slate-500 dark:text-slate-500">
				{m.hero_desc()}
			</p>

			<div class="mt-10 flex flex-wrap gap-4">
				<a
					href="/competitions/fanroc-2025/register"
					class="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-105 hover:shadow-cyan-500/40"
				>
					{m.hero_cta_register()}
					<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</a>
				<a
					href="/competitions"
					class="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-slate-100 px-7 py-4 font-semibold text-slate-700 backdrop-blur-sm transition hover:border-slate-400 hover:bg-slate-200 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/25 dark:hover:bg-white/10"
				>
					{m.hero_cta_explore()}
				</a>
			</div>

			<div class="mt-12 flex flex-wrap gap-6">
				{#each [['128+', m.hero_stats_teams()], ['542+', m.hero_stats_students()], ['27+', m.hero_stats_provinces()]] as [val, lbl]}
					<div class="text-center">
						<p class="text-2xl font-black text-cyan-600 dark:text-cyan-300">{val}</p>
						<p class="mt-0.5 text-xs text-slate-500 dark:text-slate-500">{lbl}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Hero image slot -->
		<div class="order-1 lg:order-2">
			<div class="relative">
				<div
					class="absolute -inset-8 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/15"
				></div>
				<div
					class="relative rounded-[32px] border border-slate-200 bg-white/80 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]"
				>
					<!-- IMAGE PLACEHOLDER — replace with <img src="..." alt="..."> -->
					<div
						class="relative flex h-[440px] items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-slate-300 bg-slate-50 lg:h-[520px] dark:border-white/15 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950"
					>
						<div class="pointer-events-none text-center select-none">
							<Bot class="mx-auto mb-4 h-20 w-20 text-slate-300 dark:text-cyan-400/50" />
							<p class="text-sm text-slate-400 dark:text-slate-600">{m.hero_image_placeholder()}</p>
						</div>
						<div
							class="absolute top-4 right-4 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]"
						></div>
						<div
							class="absolute bottom-4 left-4 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_2px_rgba(192,132,252,0.6)]"
						></div>
					</div>
					<div
						class="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 dark:border-white/5 dark:bg-white/[0.02]"
					>
						<div>
							<p class="text-xs text-slate-500 dark:text-slate-500">{m.hero_competition_label()}</p>
							<p class="text-sm font-semibold text-slate-800 dark:text-white">FAnRoC 2026</p>
						</div>
						<div class="text-right">
							<p class="text-xs text-slate-500 dark:text-slate-500">{m.hero_status_label()}</p>
							<p class="text-sm font-semibold text-green-600 dark:text-green-400">
								{m.hero_status_open()}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<a
		href="#about"
		class="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-slate-400 transition hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400"
		aria-label={m.hero_scroll_aria()}
	>
		<span class="text-xs tracking-widest uppercase">{m.hero_scroll_label()}</span>
		<ChevronDown class="h-5 w-5 animate-bounce" />
	</a>
</section>
