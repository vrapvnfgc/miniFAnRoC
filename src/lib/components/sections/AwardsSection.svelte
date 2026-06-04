<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { awards } from '$lib/data';
	import AwardCard from './AwardCard.svelte';
</script>

<section id="awards" class="relative px-4 py-20 sm:px-6 lg:px-8" aria-label={m.awards_title()}>
	<div class="pointer-events-none absolute inset-0">
		<div
			class="absolute top-0 h-px w-full"
			style="background: linear-gradient(90deg, transparent, rgba(251,191,36,0.3), transparent);"
		></div>
	</div>

	<div class="mx-auto max-w-6xl">
		<div class="mb-16 text-center">
			<span class="mb-3 block font-mono text-xs tracking-widest uppercase" style="color: #fbbf24;">
				// Prizes
			</span>
			<h2 class="section-title mb-4 text-3xl sm:text-4xl lg:text-5xl">
				{m.awards_title()}
			</h2>
			<p class="mx-auto max-w-xl text-sm sm:text-base" style="color: var(--text-secondary);">
				{m.awards_desc()}
			</p>
		</div>

		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
			{#each awards as award}
				<div class="relative">
					<AwardCard {award} />
				</div>
			{/each}
		</div>
	</div>
</section>
