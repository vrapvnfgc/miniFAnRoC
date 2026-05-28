<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronDown, Zap, Users, MapPin, Trophy } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import { uiStore } from '$lib/stores/ui';
	import { heroStats } from '$lib/data';
	import StatisticsCard from '../sections/StatisticsCard.svelte';

	let visible = false;
	const { switchTab } = uiStore;

	onMount(() => {
		setTimeout(() => { visible = true; }, 100);
	});

	const iconMap: Record<string, typeof Zap> = { Zap, Users, MapPin, Trophy };

	function scrollToTeams() {
		document.getElementById('teams')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section
	id="home"
	class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
	style="background: var(--bg-primary);"
	aria-label="Hero section"
>
	<!-- Background layers -->
	<div class="absolute inset-0 bg-grid-pattern opacity-100" />
	<div class="absolute inset-0 bg-glow-cyan opacity-60" style="top: 20%; left: -10%;" />
	<div class="absolute inset-0 bg-glow-purple opacity-50" style="top: 50%; right: -5%;" />

	<!-- Animated grid lines -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		{#each Array(5) as _, i}
			<div
				class="absolute w-px h-full opacity-5"
				style="left: {20 * (i + 1)}%; background: linear-gradient(to bottom, transparent, #00b4e6, transparent); animation: float {4 + i}s ease-in-out infinite; animation-delay: {i * 0.5}s;"
			/>
		{/each}
	</div>

	<!-- Floating orbs -->
	<div
		class="absolute w-96 h-96 rounded-full opacity-10 animate-float"
		style="background: radial-gradient(circle, #00b4e6, transparent); top: 10%; right: 5%; filter: blur(40px);"
	/>
	<div
		class="absolute w-64 h-64 rounded-full opacity-8 animate-float"
		style="background: radial-gradient(circle, #8b47ff, transparent); bottom: 20%; left: 5%; filter: blur(40px); animation-delay: 2s;"
	/>

	<!-- Content -->
	<div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
		<!-- Badge -->
		<div
			class="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-mono uppercase tracking-widest"
			class:opacity-0={!visible}
			class:animate-fade-in={visible}
			style="background: rgba(0, 180, 230, 0.1); border: 1px solid rgba(0, 180, 230, 0.3); color: var(--accent-cyan); animation-delay: 0.1s;"
		>
			<div class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
			{$t('hero.badge')}
		</div>

		<!-- Main title -->
		<h1
			class="font-display font-black mb-4"
			class:opacity-0={!visible}
			class:animate-slide-up={visible}
			style="animation-delay: 0.2s; font-size: clamp(3rem, 10vw, 8rem); line-height: 1;"
		>
			<span class="text-gradient">{$t('hero.title')}</span>
		</h1>

		<!-- Subtitle -->
		<p
			class="font-display text-lg sm:text-xl font-medium mb-6 tracking-widest"
			class:opacity-0={!visible}
			class:animate-slide-up={visible}
			style="color: var(--accent-cyan); animation-delay: 0.35s;"
		>
			{$t('hero.subtitle')}
		</p>

		<!-- Description -->
		<p
			class="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-12"
			class:opacity-0={!visible}
			class:animate-slide-up={visible}
			style="color: var(--text-secondary); animation-delay: 0.5s;"
		>
			{$t('hero.description')}
		</p>

		<!-- CTAs -->
		<div
			class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
			class:opacity-0={!visible}
			class:animate-fade-in={visible}
			style="animation-delay: 0.65s;"
		>
			<button
				on:click={() => { switchTab('register'); scrollToTeams(); }}
				class="btn-primary w-full sm:w-auto justify-center px-8 py-4 text-base"
			>
				<Zap size={18} />
				{$t('hero.cta_register')}
			</button>
			<button
				on:click={scrollToTeams}
				class="btn-ghost w-full sm:w-auto justify-center px-8 py-4 text-base"
			>
				{$t('hero.cta_schedule')}
			</button>
		</div>

		<!-- Stats grid -->
		<div
			class="grid grid-cols-2 lg:grid-cols-4 gap-4"
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
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
		<span class="text-xs font-mono uppercase tracking-widest" style="color: var(--text-secondary);">
			{$t('hero.scroll_down')}
		</span>
		<ChevronDown size={20} style="color: var(--accent-cyan);" />
	</div>
</section>
