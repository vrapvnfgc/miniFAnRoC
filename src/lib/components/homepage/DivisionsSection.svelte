<script lang="ts">
	import { ArrowRight, School, Globe } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<section class="px-6 py-20">
	<div class="mx-auto max-w-7xl">
		<div class="mb-14 text-center">
			<p
				class="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400"
			>
				{m.divisions_label()}
			</p>
			<h2 class="text-4xl font-black text-slate-900 dark:text-white">{m.divisions_title()}</h2>
			<p class="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
				{m.divisions_desc()}
			</p>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Internal -->
			<div
				class="group relative overflow-hidden rounded-[32px] border border-cyan-500/20 bg-gradient-to-br from-cyan-50 to-blue-50 p-10 transition hover:border-cyan-500/40 hover:shadow-lg dark:from-cyan-500/10 dark:to-blue-500/5 dark:hover:shadow-none"
			>
				<div
					class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl transition group-hover:bg-cyan-500/20"
				></div>
				<div class="relative">
					<div
						class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 ring-1 ring-cyan-500/30"
					>
						<School class="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
					</div>
					<p
						class="mb-1 text-xs font-semibold tracking-wider text-cyan-600 uppercase dark:text-cyan-400"
					>
						{m.divisions_internal_label()}
					</p>
					<h3 class="mb-4 text-3xl font-black text-slate-900 dark:text-white">
						{m.divisions_internal_title()}
					</h3>
					<p class="mb-8 text-lg leading-8 text-slate-600 dark:text-slate-300">
						{m.divisions_internal_desc()}
					</p>
					<div
						class="mb-6 flex h-32 items-center justify-center rounded-2xl border border-dashed border-cyan-500/20 bg-cyan-500/5"
					>
						<p class="text-xs text-slate-400 dark:text-slate-600">[ Internal Division image ]</p>
					</div>
					<div class="flex flex-wrap gap-3">
						<a
							href="/auth"
							class="group/btn inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
						>
							{m.btn_register_team()}
							<ArrowRight class="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
						</a>
						<a
							href="/manual"
							class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
							>{m.btn_competition_manual()}</a
						>
						<a
							href="/resources"
							class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
							>{m.btn_team_guide()}</a
						>
					</div>
				</div>
			</div>

			<!-- Open -->
			<div
				class="group relative overflow-hidden rounded-[32px] border border-purple-500/20 bg-gradient-to-br from-purple-50 to-pink-50 p-10 transition hover:border-purple-500/40 hover:shadow-lg dark:from-purple-500/10 dark:to-pink-500/5 dark:hover:shadow-none"
			>
				<div
					class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl transition group-hover:bg-purple-500/20"
				></div>
				<div class="relative">
					<div
						class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/15 ring-1 ring-purple-500/30"
					>
						<Globe class="h-7 w-7 text-purple-600 dark:text-purple-400" />
					</div>
					<p
						class="mb-1 text-xs font-semibold tracking-wider text-purple-600 uppercase dark:text-purple-400"
					>
						{m.divisions_open_label()}
					</p>
					<h3 class="mb-4 text-3xl font-black text-slate-900 dark:text-white">
						{m.divisions_open_title()}
					</h3>
					<p class="mb-8 text-lg leading-8 text-slate-600 dark:text-slate-300">
						{m.divisions_open_desc()}
					</p>
					<div
						class="mb-6 flex h-32 items-center justify-center rounded-2xl border border-dashed border-purple-500/20 bg-purple-500/5"
					>
						<p class="text-xs text-slate-400 dark:text-slate-600">[ Open Division image ]</p>
					</div>
					<div class="flex flex-wrap gap-3">
						<a
							href="/auth"
							class="group/btn inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
						>
							{m.btn_register_team()}
							<ArrowRight class="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
						</a>
						<a
							href="/manual"
							class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
							>{m.btn_competition_manual()}</a
						>
						<a
							href="/resources"
							class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
							>{m.btn_team_guide()}</a
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
