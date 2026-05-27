<script lang="ts">
  import { Menu, X, Sun, Moon, Bot, ChevronDown, Globe } from 'lucide-svelte';
  import { page } from '$app/state';
  import { themeStore } from '$lib/stores/theme.svelte';
  import { languageStore } from '$lib/stores/language.svelte';
  import { locales } from '$lib/paraglide/runtime';

  let mobileOpen = $state(false);
  let scrolled = $state(false);
  let languageOpen = $state(false);

  const navItems = [
    { label: 'Home', href: '/homepage' },
    { label: 'Team List', href: '/teams' },
    { label: 'Ranking', href: '/ranking' },
    { label: 'Matches', href: '/matches' },
    { label: 'Awards', href: '/awards' },
    {
      label: 'Resources',
      children: [
        { label: 'Competition Manual', href: '/manual' },
        { label: 'Team Guide', href: '/resources' }
      ]
    }
  ];

  let resourcesOpen = $state(false);

  $effect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => { scrolled = window.scrollY > 20; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  function toggleTheme() {
    themeStore.toggleTheme();
  }

  async function changeLanguage(locale: string) {
    await languageStore.changeLocale(locale as 'en' | 'vi');
    languageOpen = false;
  }

  function closeMobile() { mobileOpen = false; }
</script>

<nav
  class="fixed top-0 z-50 w-full transition-all duration-300"
  class:nav-scrolled={scrolled}
>
  <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
    <!-- LOGO -->
    <a href="/homepage" class="flex items-center gap-2 sm:gap-3 group shrink-0">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 transition group-hover:scale-105">
        <Bot class="h-5 w-5 text-white" />
      </div>
      <div class="hidden sm:block">
        <p class="text-base font-bold text-slate-900 dark:text-white leading-none">miniFAnRoC</p>
        <p class="text-[10px] text-cyan-600 dark:text-cyan-400 leading-none mt-0.5">FAnRoC Platform</p>
      </div>
    </a>

    <!-- DESKTOP NAV -->
    <div class="hidden items-center gap-1 lg:flex">
      {#each navItems as item}
        {#if item.children}
          <div class="relative">
            <button
              onclick={() => resourcesOpen = !resourcesOpen}
              class="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-300"
            >
              {item.label}
              <ChevronDown class="h-3.5 w-3.5 transition-transform" style={resourcesOpen ? 'transform:rotate(180deg)' : ''} />
            </button>
            {#if resourcesOpen}
              <div class="absolute top-full mt-2 left-0 min-w-[180px] rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/95 backdrop-blur-xl p-2 shadow-xl">
                {#each item.children as child}
                  <a
                    href={child.href}
                    onclick={() => resourcesOpen = false}
                    class="block rounded-lg px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-300"
                  >{child.label}</a>
                {/each}
              </div>
            {/if}
          </div>
        {:else}
          <a
            href={item.href}
            class="rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100 dark:hover:bg-white/5"
            style={page.url.pathname === item.href ? 'color: rgb(34 197 94)' : ''}
            class:text-cyan-600={page.url.pathname === item.href}
            class:dark:text-cyan-300={page.url.pathname === item.href}
            class:text-slate-600={page.url.pathname !== item.href}
            class:dark:text-slate-300={page.url.pathname !== item.href}
          >
            {item.label}
          </a>
        {/if}
      {/each}
    </div>

    <!-- DESKTOP ACTIONS -->
    <div class="hidden items-center gap-2 sm:gap-3 lg:flex">
      <!-- Language toggle -->
      <div class="relative">
        <button
          onclick={() => languageOpen = !languageOpen}
          class="rounded-lg border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
        >
          <Globe class="h-3.5 w-3.5" />
          <span class="uppercase">{languageStore.locale}</span>
        </button>
        {#if languageOpen}
          <div class="absolute top-full mt-2 right-0 min-w-[100px] rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/95 backdrop-blur-xl p-1 shadow-xl">
            {#each locales as locale}
              <button
                onclick={() => changeLanguage(locale)}
                class="w-full text-left block rounded px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-300 uppercase"
              >
                {locale}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Theme toggle -->
      <button
        onclick={toggleTheme}
        class="rounded-lg border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
        aria-label="Toggle theme"
        title={themeStore.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {#if themeStore.theme === 'dark'}
          <Sun class="h-4 w-4" />
        {:else}
          <Moon class="h-4 w-4" />
        {/if}
      </button>

      <a
        href="/login"
        class="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105 hover:shadow-cyan-500/40"
      >
        Login / Sign Up
      </a>
    </div>

    <!-- MOBILE ACTIONS (shown between logo and hamburger) -->
    <div class="flex items-center gap-2 lg:hidden">
      <!-- Mobile theme toggle -->
      <button
        onclick={toggleTheme}
        class="rounded-lg border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
        aria-label="Toggle theme"
        title={themeStore.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {#if themeStore.theme === 'dark'}
          <Sun class="h-4 w-4" />
        {:else}
          <Moon class="h-4 w-4" />
        {/if}
      </button>
    </div>

    <!-- MOBILE HAMBURGER -->
    <button
      class="rounded-lg border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-slate-900 dark:text-white lg:hidden"
      onclick={() => mobileOpen = !mobileOpen}
      aria-label="Toggle menu"
    >
      {#if mobileOpen}
        <X class="h-5 w-5" />
      {:else}
        <Menu class="h-5 w-5" />
      {/if}
    </button>
  </div>

  <!-- MOBILE MENU -->
  {#if mobileOpen}
    <div class="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/98 backdrop-blur-xl lg:hidden">
      <div class="flex flex-col gap-1 px-4 py-4">
        {#each navItems as item}
          {#if item.children}
            {#each item.children as child}
              <a href={child.href} onclick={closeMobile} class="rounded-lg px-4 py-3 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-300">
                {child.label}
              </a>
            {/each}
          {:else}
            <a href={item.href} onclick={closeMobile} class="rounded-lg px-4 py-3 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-300">
              {item.label}
            </a>
          {/if}
        {/each}
        <div class="mt-4 border-t border-slate-200 dark:border-white/10 pt-4 flex flex-col gap-3 px-1">
          <!-- Language selector -->
          <div class="flex items-center gap-2">
            <Globe class="h-4 w-4 text-slate-600 dark:text-slate-300" />
            <div class="flex gap-2 flex-wrap">
              {#each locales as locale}
                <button
                  onclick={() => changeLanguage(locale)}
                  class="rounded px-3 py-1.5 text-xs font-medium uppercase transition dark:bg-white/5 dark:text-slate-300"
                  class:bg-cyan-500={locale === languageStore.locale}
                  class:text-white={locale === languageStore.locale}
                  class:bg-slate-100={locale !== languageStore.locale}
                  class:text-slate-600={locale !== languageStore.locale}
                >
                  {locale}
                </button>
              {/each}
            </div>
          </div>
          <a href="/login" onclick={closeMobile} class="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white">
            Login / Sign Up
          </a>
        </div>
      </div>
    </div>
  {/if}
</nav>

<style>
  /* Scrolled state: light = white frosted, dark = dark frosted */
  :global(html:not(.dark)) nav.nav-scrolled {
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 1px 12px rgba(0,0,0,0.06);
  }
  :global(html.dark) nav.nav-scrolled {
    background: rgba(2, 6, 23, 0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
</style>
