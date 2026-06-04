<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronDown, Zap, Users, MapPin, Trophy } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';
	import { uiStore } from '$lib/stores/ui';
	import { heroStats } from '$lib/data';
	import StatisticsCard from '../sections/StatisticsCard.svelte';

	let visible = $state(false);
	const { switchTab } = uiStore;

	onMount(() => {
		setTimeout(() => {
			visible = true;
		}, 100);
	});

	const iconMap: Record<string, typeof Zap> = { Zap, Users, MapPin, Trophy };

	function scrollToTeams() {
		document.getElementById('teams')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section
	id="home"
	class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
	style="background: var(--bg-primary);"
	aria-label="Hero section"
>
	<!-- Background layers -->
	<div class="bg-grid-pattern absolute inset-0 opacity-100"></div>
	<div class="bg-glow-cyan absolute inset-0 opacity-60" style="top: 20%; left: -10%;"></div>
	<div class="bg-glow-purple absolute inset-0 opacity-50" style="top: 50%; right: -5%;"></div>

	<!-- Animated grid lines -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		{#each Array(5) as _, i}
			<div
				class="absolute h-full w-px opacity-5"
				style="left: {20 *
					(i +
						1)}%; background: linear-gradient(to bottom, transparent, #00b4e6, transparent); animation: float {4 +
					i}s ease-in-out infinite; animation-delay: {i * 0.5}s;"
			></div>
		{/each}
	</div>

	<!-- Floating orbs -->
	<div
		class="animate-float absolute h-96 w-96 rounded-full opacity-10"
		style="background: radial-gradient(circle, #00b4e6, transparent); top: 10%; right: 5%; filter: blur(40px);"
	></div>
	<div
		class="animate-float absolute h-64 w-64 rounded-full opacity-8"
		style="background: radial-gradient(circle, #8b47ff, transparent); bottom: 20%; left: 5%; filter: blur(40px); animation-delay: 2s;"
	></div>

	<!-- Content -->
	<div class="relative z-10 mx-auto max-w-6xl px-4 pt-24 pb-16 text-center sm:px-6 lg:px-8">
		<!-- Badge -->
		<div
			class="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs tracking-widest uppercase"
			class:opacity-0={!visible}
			class:animate-fade-in={visible}
			style="background: rgba(0, 180, 230, 0.1); border: 1px solid rgba(0, 180, 230, 0.3); color: var(--accent-cyan); animation-delay: 0.1s;"
		>
			<div class="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400"></div>
			{m.hero_badge()}
		</div>

		<!-- Main title -->
		<h1
			class="font-display mb-4 font-black"
			class:opacity-0={!visible}
			class:animate-slide-up={visible}
			style="animation-delay: 0.2s; font-size: clamp(3rem, 10vw, 8rem); line-height: 1;"
		>
			<span class="text-gradient">{m.hero_title()}</span>
		</h1>

		<!-- Subtitle -->
		<p
			class="font-display mb-6 text-lg font-medium tracking-widest sm:text-xl"
			class:opacity-0={!visible}
			class:animate-slide-up={visible}
			style="color: var(--accent-cyan); animation-delay: 0.35s;"
		>
			{m.hero_subtitle()}
		</p>

		<!-- Description -->
		<p
			class="mx-auto mb-12 max-w-2xl text-base leading-relaxed sm:text-lg"
			class:opacity-0={!visible}
			class:animate-slide-up={visible}
			style="color: var(--text-secondary); animation-delay: 0.5s;"
		>
			{m.hero_desc()}
		</p>

		<!-- CTAs -->
		<div
			class="mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row"
			class:opacity-0={!visible}
			class:animate-fade-in={visible}
			style="animation-delay: 0.65s;"
		>
			<button
				onclick={() => {
					switchTab('register');
					scrollToTeams();
				}}
				class="btn-primary w-full justify-center px-8 py-4 text-base sm:w-auto"
			>
				<Zap size={18} />
				{m.hero_cta_register()}
			</button>
			<button
				onclick={scrollToTeams}
				class="btn-ghost w-full justify-center px-8 py-4 text-base sm:w-auto"
			>
				{m.hero_cta_explore()}
			</button>
		</div>

		<!-- Stats grid -->
		<div
			class="grid grid-cols-2 gap-4 lg:grid-cols-4"
			class:opacity-0={!visible}
			class:animate-fade-in={visible}
			style="animation-delay: 0.8s;"
		>
			{#each heroStats as stat}
				<StatisticsCard {stat} />
			{/each}
		</div>
	</div>

	<!-- Scroll indicator -->
	<div
		class="absolute bottom-8 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center gap-2"
	>
		<span class="font-mono text-xs tracking-widest uppercase" style="color: var(--text-secondary);">
			{m.hero_scroll_label()}
		</span>
		<ChevronDown size={20} style="color: var(--accent-cyan);" />
	</div>
</section>
