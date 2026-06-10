<script lang="ts">
	import { ArrowRight, UserPlus } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<section class="px-6 py-24">
	<div class="mx-auto max-w-6xl">
		<div
			class="relative overflow-hidden rounded-[40px] border border-slate-200 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 p-12 text-center shadow-sm md:p-20 dark:border-white/10 dark:from-cyan-500/10 dark:via-blue-500/5 dark:to-purple-500/10 dark:shadow-none"
		>
			<div
				class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(14,165,233,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(14,165,233,0.15),transparent)]"
			></div>
			<div
				class="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px)]"
			></div>
			<div
				class="pointer-events-none absolute top-0 left-1/4 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl"
			></div>
			<div
				class="pointer-events-none absolute right-1/4 bottom-0 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl"
			></div>

			<div class="relative">
				<p
					class="mb-4 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400"
				>
					{m.cta_label()}
				</p>
				<h2
					class="text-4xl leading-tight font-black text-slate-900 md:text-5xl lg:text-6xl dark:text-white"
				>
					{m.cta_title()}
				</h2>
				<p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
					{m.cta_desc()}
				</p>
				<div class="mt-10 flex flex-wrap justify-center gap-4">
					<a
						href="/auth"
						class="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-xl shadow-cyan-500/20 transition hover:scale-105 hover:shadow-cyan-500/40"
					>
						<UserPlus class="h-5 w-5" />
						{m.btn_sign_up()}
					</a>
					<a
						href="/auth"
						class="group inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 backdrop-blur-sm transition hover:border-slate-400 hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10"
					>
						{m.btn_register_team()}
						<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
