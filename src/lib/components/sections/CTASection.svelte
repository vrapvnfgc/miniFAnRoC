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

<section class="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
	<!-- Decorative bg -->
	<div class="absolute inset-0">
		<div class="bg-glow-cyan absolute inset-0 opacity-40"></div>
		<div class="bg-glow-purple absolute inset-0 opacity-30"></div>
		<div class="bg-grid-pattern absolute inset-0"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-3xl text-center">
		<div
			class="animate-float mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl"
			style="background: linear-gradient(135deg, rgba(0,180,230,0.2), rgba(139,71,255,0.2)); border: 2px solid rgba(0,180,230,0.4); box-shadow: 0 0 40px rgba(0,180,230,0.3);"
		>
			<Rocket size={36} style="color: var(--accent-cyan);" />
		</div>

		<h2
			class="font-display text-gradient mb-6 text-3xl font-black sm:text-5xl"
			style="line-height: 1.1;"
		>
			{$t('hero.cta_register')}
		</h2>
		<p class="mb-10 text-base sm:text-lg" style="color: var(--text-secondary);">
			{$t('hero.description')}
		</p>

		<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			<button
				onclick={handleRegister}
				class="btn-primary w-full justify-center px-10 py-4 text-base sm:w-auto"
			>
				<Rocket size={18} />
				{$t('hero.cta_register')}
				<ArrowRight size={16} />
			</button>
			<a href="#sponsors" class="btn-ghost w-full justify-center px-8 py-4 sm:w-auto">
				{$t('sponsors.title')}
			</a>
		</div>
	</div>
</section>
