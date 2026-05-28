<script lang="ts">
	import { Trophy, Medal, Award, Lightbulb, Heart, Sprout } from 'lucide-svelte';
	import type { Award as AwardType } from '$lib/data';
	import { t } from '$lib/i18n';

	export let award: AwardType;

	const iconMap: Record<string, typeof Trophy> = {
		trophy: Trophy, medal: Medal, award: Award,
		lightbulb: Lightbulb, heart: Heart, sprout: Sprout
	};

	$: Icon = iconMap[award.icon] ?? Trophy;
	$: isTop3 = award.rank <= 3;
</script>

<article
	class="glass-card-hover p-6 flex flex-col items-center text-center group"
	aria-label={$t(award.titleKey)}
>
	<!-- Icon with gradient bg -->
	<div
		class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
		style="background: linear-gradient(135deg, {award.color.includes('yellow') ? '#fbbf24, #f59e0b' : award.color.includes('slate') ? '#94a3b8, #64748b' : award.color.includes('amber') ? '#d97706, #b45309' : award.color.includes('cyber') ? '#00b4e6, #8b47ff' : award.color.includes('pink') ? '#ec4899, #f43f5e' : '#22c55e, #10b981'});"
	>
		<svelte:component this={Icon} size={28} class="text-white drop-shadow-lg" />
	</div>

	<!-- Title -->
	<h3
		class="font-display font-bold text-lg mb-1 transition-all duration-300"
		class:text-gradient-gold={award.rank === 1}
		class:text-gradient={award.rank !== 1}
	>
		{$t(award.titleKey)}
	</h3>

	<!-- Prize -->
	<div
		class="font-mono font-bold text-base"
		style="color: var(--accent-cyan);"
	>
		{award.prize}
	</div>

	{#if isTop3}
		<div
			class="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono"
			style="background: linear-gradient(135deg, #00b4e6, #8b47ff); color: white;"
		>
			{award.rank}
		</div>
	{/if}
</article>
