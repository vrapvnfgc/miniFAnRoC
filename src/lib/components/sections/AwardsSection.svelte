<script lang="ts">
	import { t } from '$lib/i18n';
	import { awards } from '$lib/data';
	import AwardCard from './AwardCard.svelte';
</script>

<section id="awards" class="relative py-20 px-4 sm:px-6 lg:px-8" aria-label={$t('awards.title')}>
	<div class="absolute inset-0 pointer-events-none">
		<div class="absolute w-full h-px top-0" style="background: linear-gradient(90deg, transparent, rgba(251,191,36,0.3), transparent);" />
	</div>

	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16">
			<span class="font-mono text-xs uppercase tracking-widest mb-3 block" style="color: #fbbf24;">
				// Prizes
			</span>
			<h2 class="section-title text-3xl sm:text-4xl lg:text-5xl mb-4">
				{$t('awards.title')}
			</h2>
			<p class="max-w-xl mx-auto text-sm sm:text-base" style="color: var(--text-secondary);">
				{$t('awards.subtitle')}
			</p>
		</div>

		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
			{#each awards as award}
				<div class="relative">
					<AwardCard {award} />
				</div>
			{/each}
		</div>
	</div>
</section>
