<script lang="ts">
	import { onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import { Menu, X, Moon, Sun, Globe, Bot } from 'lucide-svelte';
	import { t, locale, setLocale, type Locale } from '$lib/i18n';
	import { uiStore } from '$lib/stores/ui';

	const { theme, mobileMenuOpen, toggleTheme, switchTab } = uiStore;

	const navLinks = [
		{ key: 'nav.home', href: '#home' },
		{ key: 'nav.teams', href: '#teams' },
		{ key: 'nav.schedule', href: '#schedule' },
		{ key: 'nav.awards', href: '#awards' },
		{ key: 'nav.sponsors', href: '#sponsors' }
	];

	let scrolled = false;

	onMount(() => {
		const handler = () => { scrolled = window.scrollY > 20; };
		window.addEventListener('scroll', handler);
		return () => window.removeEventListener('scroll', handler);
	});

	function toggleLang() {
		setLocale($locale === 'vi' ? 'en' : 'vi');
	}

	function handleTeamNav() {
		switchTab('list');
		document.getElementById('teams')?.scrollIntoView({ behavior: 'smooth' });
		mobileMenuOpen.set(false);
	}
</script>

<header
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
	class:scrolled
>
	<!-- Blur backdrop when scrolled -->
	{#if scrolled}
		<div
			class="absolute inset-0 backdrop-blur-xl"
			style="background: rgba(8, 13, 28, 0.85); border-bottom: 1px solid rgba(0, 180, 230, 0.15);"
			transition:fade={{ duration: 200 }}
		/>
	{/if}

	<nav class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
		<!-- Logo -->
		<a
			href="#home"
			class="flex items-center gap-2.5 group"
			aria-label="miniFAnRoC Home"
		>
			<div class="relative w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
				style="background: linear-gradient(135deg, #00b4e6, #8b47ff);">
				<Bot size={20} class="text-white relative z-10" />
				<div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					style="background: linear-gradient(135deg, #00f5ff, #a855f7);" />
			</div>
			<span class="font-display font-bold text-lg tracking-wider text-gradient hidden sm:block">
				miniFAnRoC
			</span>
		</a>

		<!-- Desktop nav -->
		<div class="hidden md:flex items-center gap-1">
			{#each navLinks as link}
				<a
					href={link.href}
					class="px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
					style="color: var(--text-secondary);"
					on:mouseenter={(e) => {
						e.currentTarget.style.color = 'var(--accent-cyan)';
						e.currentTarget.style.background = 'rgba(0, 180, 230, 0.08)';
					}}
					on:mouseleave={(e) => {
						e.currentTarget.style.color = 'var(--text-secondary)';
						e.currentTarget.style.background = 'transparent';
					}}
				>
					{$t(link.key)}
				</a>
			{/each}
		</div>

		<!-- Controls -->
		<div class="flex items-center gap-2">
			<!-- Language toggle -->
			<button
				on:click={toggleLang}
				class="btn-ghost flex items-center gap-1.5 !px-3 !py-2"
				aria-label={$t('nav.language')}
				title={$t('nav.language')}
			>
				<Globe size={14} />
				<span class="text-xs font-mono font-bold uppercase">
					{$locale === 'vi' ? 'EN' : 'VI'}
				</span>
			</button>

			<!-- Theme toggle -->
			<button
				on:click={toggleTheme}
				class="btn-ghost !px-2.5 !py-2"
				aria-label="Toggle theme"
			>
				{#if $theme === 'dark'}
					<Sun size={16} />
				{:else}
					<Moon size={16} />
				{/if}
			</button>

			<!-- CTA desktop -->
			<button
				on:click={() => { switchTab('register'); document.getElementById('teams')?.scrollIntoView({ behavior: 'smooth' }); }}
				class="btn-primary hidden sm:inline-flex !py-2 !px-4 text-xs"
			>
				{$t('register.submit')}
			</button>

			<!-- Mobile hamburger -->
			<button
				on:click={() => mobileMenuOpen.update(v => !v)}
				class="md:hidden btn-ghost !px-2.5 !py-2"
				aria-label="Toggle menu"
				aria-expanded={$mobileMenuOpen}
			>
				{#if $mobileMenuOpen}
					<X size={18} />
				{:else}
					<Menu size={18} />
				{/if}
			</button>
		</div>
	</nav>

	<!-- Mobile menu -->
	{#if $mobileMenuOpen}
		<div
			class="md:hidden border-t"
			style="background: rgba(8, 13, 28, 0.97); border-color: var(--border-color);"
			transition:slide={{ duration: 250 }}
		>
			<div class="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
				{#each navLinks as link}
					<a
						href={link.href}
						class="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
						style="color: var(--text-secondary);"
						on:click={() => mobileMenuOpen.set(false)}
					>
						{$t(link.key)}
					</a>
				{/each}
				<div class="h-px my-2" style="background: var(--border-color);" />
				<button
					on:click={handleTeamNav}
					class="btn-primary w-full justify-center"
				>
					{$t('register.submit')}
				</button>
			</div>
		</div>
	{/if}
</header>


