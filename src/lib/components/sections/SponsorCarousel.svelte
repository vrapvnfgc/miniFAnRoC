<script lang="ts">
	import { t } from '$lib/i18n';
	import { sponsors } from '$lib/data';

	const platinum = sponsors.filter((s) => s.tier === 'platinum');
	const gold = sponsors.filter((s) => s.tier === 'gold');
	const silver = sponsors.filter((s) => s.tier === 'silver');

	const tierColors = {
		platinum: 'rgba(226,232,240,0.2)',
		gold: 'rgba(251,191,36,0.15)',
		silver: 'rgba(100,116,139,0.15)'
	};
	const tierBorders = {
		platinum: 'rgba(226,232,240,0.4)',
		gold: 'rgba(251,191,36,0.35)',
		silver: 'rgba(100,116,139,0.3)'
	};
</script>

<section
	id="sponsors"
	class="relative px-4 py-20 sm:px-6 lg:px-8"
	aria-label={$t('sponsors.title')}
>
	<div class="pointer-events-none absolute inset-0">
		<div
			class="absolute top-0 h-px w-full"
			style="background: linear-gradient(90deg, transparent, rgba(100,116,139,0.3), transparent);"
		></div>
	</div>

	<div class="mx-auto max-w-6xl">
		<div class="mb-16 text-center">
			<span
				class="mb-3 block font-mono text-xs tracking-widest uppercase"
				style="color: var(--text-secondary);"
			>
				// Partners
			</span>
			<h2 class="section-title mb-4 text-3xl sm:text-4xl lg:text-5xl">
				{$t('sponsors.title')}
			</h2>
			<p class="mx-auto max-w-xl text-sm sm:text-base" style="color: var(--text-secondary);">
				{$t('sponsors.subtitle')}
			</p>
		</div>

		<!-- Platinum -->
		<div class="mb-10">
			<div class="mb-5 flex items-center gap-3">
				<div
					class="h-px flex-1"
					style="background: linear-gradient(to right, rgba(226,232,240,0.4), transparent);"
				></div>
				<span
					class="rounded-full px-3 py-1 font-mono text-xs tracking-widest uppercase"
					style="background: rgba(226,232,240,0.1); border: 1px solid rgba(226,232,240,0.3); color: #e2e8f0;"
				>
					{$t('sponsors.partner_types.platinum')}
				</span>
				<div
					class="h-px flex-1"
					style="background: linear-gradient(to left, rgba(226,232,240,0.4), transparent);"
				></div>
			</div>
			<div class="grid grid-cols-2 gap-4">
				{#each platinum as s}
					<a
						href={s.url}
						target="_blank"
						rel="noopener noreferrer"
						class="glass-card-hover group flex items-center justify-center py-8"
					>
						<span
							class="font-display text-gradient text-2xl font-black tracking-widest transition-transform duration-300 group-hover:scale-105 sm:text-3xl"
						>
							{s.logo}
						</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Gold -->
		<div class="mb-10">
			<div class="mb-5 flex items-center gap-3">
				<div
					class="h-px flex-1"
					style="background: linear-gradient(to right, rgba(251,191,36,0.4), transparent);"
				></div>
				<span
					class="rounded-full px-3 py-1 font-mono text-xs tracking-widest uppercase"
					style="background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); color: #fbbf24;"
				>
					{$t('sponsors.partner_types.gold')}
				</span>
				<div
					class="h-px flex-1"
					style="background: linear-gradient(to left, rgba(251,191,36,0.4), transparent);"
				></div>
			</div>
			<div class="grid grid-cols-3 gap-4">
				{#each gold as s}
					<a
						href={s.url}
						target="_blank"
						rel="noopener noreferrer"
						class="glass-card-hover group flex items-center justify-center py-6"
					>
						<span
							class="font-display text-gradient-gold text-lg font-bold tracking-wider transition-transform duration-300 group-hover:scale-105 sm:text-xl"
						>
							{s.logo}
						</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Silver -->
		<div>
			<div class="mb-5 flex items-center gap-3">
				<div
					class="h-px flex-1"
					style="background: linear-gradient(to right, rgba(100,116,139,0.4), transparent);"
				></div>
				<span
					class="rounded-full px-3 py-1 font-mono text-xs tracking-widest uppercase"
					style="background: rgba(100,116,139,0.1); border: 1px solid rgba(100,116,139,0.3); color: #94a3b8;"
				>
					{$t('sponsors.partner_types.silver')}
				</span>
				<div
					class="h-px flex-1"
					style="background: linear-gradient(to left, rgba(100,116,139,0.4), transparent);"
				></div>
			</div>
			<div class="grid grid-cols-4 gap-3">
				{#each silver as s}
					<a
						href={s.url}
						target="_blank"
						rel="noopener noreferrer"
						class="glass-card-hover group flex items-center justify-center py-5"
					>
						<span
							class="font-mono text-sm font-bold tracking-wider transition-transform duration-300 group-hover:scale-105"
							style="color: var(--text-secondary);"
						>
							{s.logo}
						</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>
