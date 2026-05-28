<script lang="ts">
	import { Rocket, ArrowRight } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import { uiStore } from '$lib/stores/ui';

	const { switchTab } = uiStore;

	function handleRegister() {
		switchTab('register');
		document.getElementById('teams')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section class="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
	<!-- Decorative bg -->
	<div class="absolute inset-0">
		<div class="absolute inset-0 bg-glow-cyan opacity-40" />
		<div class="absolute inset-0 bg-glow-purple opacity-30" />
		<div class="absolute inset-0 bg-grid-pattern" />
	</div>

	<div class="relative z-10 max-w-3xl mx-auto text-center">
		<div
			class="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center animate-float"
			style="background: linear-gradient(135deg, rgba(0,180,230,0.2), rgba(139,71,255,0.2)); border: 2px solid rgba(0,180,230,0.4); box-shadow: 0 0 40px rgba(0,180,230,0.3);"
		>
			<Rocket size={36} style="color: var(--accent-cyan);" />
		</div>

		<h2 class="font-display font-black text-3xl sm:text-5xl mb-6 text-gradient" style="line-height: 1.1;">
			{$t('hero.cta_register')}
		</h2>
		<p class="text-base sm:text-lg mb-10" style="color: var(--text-secondary);">
			{$t('hero.description')}
		</p>

		<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
			<button
				on:click={handleRegister}
				class="btn-primary w-full sm:w-auto justify-center px-10 py-4 text-base"
			>
				<Rocket size={18} />
				{$t('hero.cta_register')}
				<ArrowRight size={16} />
			</button>
			<a
				href="#sponsors"
				class="btn-ghost w-full sm:w-auto justify-center px-8 py-4"
			>
				{$t('sponsors.title')}
			</a>
		</div>
	</div>
</section>
