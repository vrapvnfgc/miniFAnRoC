<script lang="ts">
	import { Trophy, Users, School, Globe } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages';

	const stats = [
		{
			icon: Trophy,
			label: m.stats_teams(),
			value: 128,
			suffix: '+',
			iconColor: 'text-yellow-600 dark:text-yellow-400',
			iconBg: 'bg-yellow-500/10',
			numColor: 'text-yellow-600 dark:text-yellow-400'
		},
		{
			icon: Users,
			label: m.stats_students(),
			value: 542,
			suffix: '+',
			iconColor: 'text-cyan-600 dark:text-cyan-400',
			iconBg: 'bg-cyan-500/10',
			numColor: 'text-cyan-600 dark:text-cyan-400'
		},
		{
			icon: School,
			label: m.stats_schools(),
			value: 61,
			suffix: '+',
			iconColor: 'text-blue-600 dark:text-blue-400',
			iconBg: 'bg-blue-500/10',
			numColor: 'text-blue-600 dark:text-blue-400'
		},
		{
			icon: Globe,
			label: m.stats_provinces(),
			value: 27,
			suffix: '+',
			iconColor: 'text-emerald-600 dark:text-emerald-400',
			iconBg: 'bg-emerald-500/10',
			numColor: 'text-emerald-600 dark:text-emerald-400'
		}
	] as const;

	let counts = $state([0, 0, 0, 0]);
	let triggered = false;

	onMount(() => {
		const el = document.getElementById('stats-section');
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting || triggered) return;
				triggered = true;
				stats.forEach((s, i) => {
					const totalSteps = 60;
					const stepDuration = 1800 / totalSteps;
					let step = 0;
					const interval = setInterval(() => {
						step++;
						if (step >= totalSteps) {
							counts[i] = s.value;
							clearInterval(interval);
						} else {
							counts[i] = Math.floor((s.value * step) / totalSteps);
						}
					}, stepDuration);
				});
			},
			{ threshold: 0.3 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<section id="stats-section" class="bg-slate-50 px-6 py-28 dark:bg-slate-900/40">
	<div class="mx-auto max-w-7xl">
		<div class="mb-12 text-center">
			<p
				class="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400"
			>
				{m.stats_label()}
			</p>
			<h2 class="text-4xl font-black text-slate-900 dark:text-slate-100">{m.stats_title()}</h2>
		</div>
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each stats as s, i}
				{@const Icon = s.icon}
				<div
					class="group relative rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-slate-800/50 dark:shadow-none dark:hover:border-white/20"
				>
					<div
						class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl {s.iconBg} ring-1 ring-black/5 dark:ring-white/10"
					>
						<Icon class="h-7 w-7 {s.iconColor}" />
					</div>
					<p class="text-5xl font-black {s.numColor} tabular-nums">{counts[i]}{s.suffix}</p>
					<p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
