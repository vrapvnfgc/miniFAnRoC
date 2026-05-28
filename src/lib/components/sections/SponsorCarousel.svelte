<script lang="ts">
	import { t } from '$lib/i18n';
	import { sponsors } from '$lib/data';

	const platinum = sponsors.filter(s => s.tier === 'platinum');
	const gold = sponsors.filter(s => s.tier === 'gold');
	const silver = sponsors.filter(s => s.tier === 'silver');

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

<section id="sponsors" class="relative py-20 px-4 sm:px-6 lg:px-8" aria-label={$t('sponsors.title')}>
	<div class="absolute inset-0 pointer-events-none">
		<div class="absolute w-full h-px top-0" style="background: linear-gradient(90deg, transparent, rgba(100,116,139,0.3), transparent);" />
	</div>

	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16">
			<span class="font-mono text-xs uppercase tracking-widest mb-3 block" style="color: var(--text-secondary);">
				// Partners
			</span>
			<h2 class="section-title text-3xl sm:text-4xl lg:text-5xl mb-4">
				{$t('sponsors.title')}
			</h2>
			<p class="max-w-xl mx-auto text-sm sm:text-base" style="color: var(--text-secondary);">
				{$t('sponsors.subtitle')}
			</p>
		</div>

		<!-- Platinum -->
		<div class="mb-10">
			<div class="flex items-center gap-3 mb-5">
				<div class="h-px flex-1" style="background: linear-gradient(to right, rgba(226,232,240,0.4), transparent);" />
				<span class="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full"
					style="background: rgba(226,232,240,0.1); border: 1px solid rgba(226,232,240,0.3); color: #e2e8f0;">
					{$t('sponsors.partner_types.platinum')}
				</span>
				<div class="h-px flex-1" style="background: linear-gradient(to left, rgba(226,232,240,0.4), transparent);" />
			</div>
			<div class="grid grid-cols-2 gap-4">
				{#each platinum as s}
					<a
						href={s.url}
						target="_blank"
						rel="noopener noreferrer"
						class="glass-card-hover py-8 flex items-center justify-center group"
					>
						<span class="font-display font-black text-2xl sm:text-3xl tracking-widest text-gradient group-hover:scale-105 transition-transform duration-300">
							{s.logo}
						</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Gold -->
		<div class="mb-10">
			<div class="flex items-center gap-3 mb-5">
				<div class="h-px flex-1" style="background: linear-gradient(to right, rgba(251,191,36,0.4), transparent);" />
				<span class="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full"
					style="background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); color: #fbbf24;">
					{$t('sponsors.partner_types.gold')}
				</span>
				<div class="h-px flex-1" style="background: linear-gradient(to left, rgba(251,191,36,0.4), transparent);" />
			</div>
			<div class="grid grid-cols-3 gap-4">
				{#each gold as s}
					<a
						href={s.url}
						target="_blank"
						rel="noopener noreferrer"
						class="glass-card-hover py-6 flex items-center justify-center group"
					>
						<span class="font-display font-bold text-lg sm:text-xl tracking-wider text-gradient-gold group-hover:scale-105 transition-transform duration-300">
							{s.logo}
						</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Silver -->
		<div>
			<div class="flex items-center gap-3 mb-5">
				<div class="h-px flex-1" style="background: linear-gradient(to right, rgba(100,116,139,0.4), transparent);" />
				<span class="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full"
					style="background: rgba(100,116,139,0.1); border: 1px solid rgba(100,116,139,0.3); color: #94a3b8;">
					{$t('sponsors.partner_types.silver')}
				</span>
				<div class="h-px flex-1" style="background: linear-gradient(to left, rgba(100,116,139,0.4), transparent);" />
			</div>
			<div class="grid grid-cols-4 gap-3">
				{#each silver as s}
					<a
						href={s.url}
						target="_blank"
						rel="noopener noreferrer"
						class="glass-card-hover py-5 flex items-center justify-center group"
					>
						<span class="font-mono font-bold text-sm tracking-wider group-hover:scale-105 transition-transform duration-300"
							style="color: var(--text-secondary);">
							{s.logo}
						</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>
