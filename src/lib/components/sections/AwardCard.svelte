<script lang="ts">
	import { Trophy, Medal, Award, Lightbulb, Heart, Sprout } from 'lucide-svelte';
	import type { Award as AwardType } from '$lib/data';
	import { t } from '$lib/i18n';

	let { award }: { award: AwardType } = $props();

	const iconMap: Record<string, typeof Trophy> = {
		trophy: Trophy,
		medal: Medal,
		award: Award,
		lightbulb: Lightbulb,
		heart: Heart,
		sprout: Sprout
	};

	let Icon = $derived(iconMap[award.icon] ?? Trophy);
	let isTop3 = $derived(award.rank <= 3);
</script>

<article
	class="glass-card-hover group flex flex-col items-center p-6 text-center"
	aria-label={$t(award.titleKey)}
>
	<!-- Icon with gradient bg -->
	<div
		class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
		style="background: linear-gradient(135deg, {award.color.includes('yellow')
			? '#fbbf24, #f59e0b'
			: award.color.includes('slate')
				? '#94a3b8, #64748b'
				: award.color.includes('amber')
					? '#d97706, #b45309'
					: award.color.includes('cyber')
						? '#00b4e6, #8b47ff'
						: award.color.includes('pink')
							? '#ec4899, #f43f5e'
							: '#22c55e, #10b981'});"
	>
		<Icon size={28} class="text-white drop-shadow-lg" />
	</div>

	<!-- Title -->
	<h3
		class="font-display mb-1 text-lg font-bold transition-all duration-300"
		class:text-gradient-gold={award.rank === 1}
		class:text-gradient={award.rank !== 1}
	>
		{$t(award.titleKey)}
	</h3>

	<!-- Prize -->
	<div class="font-mono text-base font-bold" style="color: var(--accent-cyan);">
		{award.prize}
	</div>

	{#if isTop3}
		<div
			class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-bold"
			style="background: linear-gradient(135deg, #00b4e6, #8b47ff); color: white;"
		>
			{award.rank}
		</div>
	{/if}
</article>
