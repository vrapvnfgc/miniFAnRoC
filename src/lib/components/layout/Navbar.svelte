<script lang="ts">
  import { Menu, X, Sun, Moon, Bot, ChevronDown } from 'lucide-svelte';
  import { page } from '$app/state';

  let mobileOpen = $state(false);
  let scrolled = $state(false);
  let darkMode = $state(true);

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
    darkMode = !darkMode;
    document.documentElement.classList.toggle('dark', darkMode);
  }

  function closeMobile() { mobileOpen = false; }
</script>

<nav
  class="fixed top-0 z-50 w-full transition-all duration-300"
  class:scrolled
  style={scrolled
    ? 'background: rgba(2,6,23,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.08);'
    : 'background: transparent;'}
>
  <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    <!-- LOGO -->
    <a href="/homepage" class="flex items-center gap-3 group">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 transition group-hover:scale-105">
        <Bot class="h-5 w-5 text-white" />
      </div>
      <div>
        <p class="text-base font-bold text-white leading-none">miniFAnRoC</p>
        <p class="text-[10px] text-cyan-400 leading-none mt-0.5">FAnRoC Platform</p>
      </div>
    </a>

    <!-- DESKTOP NAV -->
    <div class="hidden items-center gap-1 lg:flex">
      {#each navItems as item}
        {#if item.children}
          <div class="relative">
            <button
              onclick={() => resourcesOpen = !resourcesOpen}
              class="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-cyan-300"
            >
              {item.label}
              <ChevronDown class="h-3.5 w-3.5 transition-transform" style={resourcesOpen ? 'transform:rotate(180deg)' : ''} />
            </button>
            {#if resourcesOpen}
              <div class="absolute top-full mt-2 left-0 min-w-[180px] rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl p-2 shadow-xl">
                {#each item.children as child}
                  <a
                    href={child.href}
                    onclick={() => resourcesOpen = false}
                    class="block rounded-lg px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-cyan-300"
                  >{child.label}</a>
                {/each}
              </div>
            {/if}
          </div>
        {:else}
          <a
            href={item.href}
            class="rounded-lg px-3 py-2 text-sm transition hover:bg-white/5"
            style={page.url.pathname === item.href ? 'color: rgb(103 232 249)' : 'color: rgb(203 213 225)'}
          >
            {item.label}
          </a>
        {/if}
      {/each}
    </div>

    <!-- DESKTOP ACTIONS -->
    <div class="hidden items-center gap-3 lg:flex">
      <!-- Lang toggle - placeholder -->
      <button class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
        EN / VI
      </button>

      <!-- Theme toggle -->
      <button
        onclick={toggleTheme}
        class="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
        aria-label="Toggle theme"
      >
        {#if darkMode}
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

    <!-- MOBILE HAMBURGER -->
    <button
      class="rounded-lg border border-white/10 bg-white/5 p-2 text-white lg:hidden"
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
    <div class="border-t border-white/10 bg-slate-950/98 backdrop-blur-xl lg:hidden">
      <div class="flex flex-col gap-1 px-4 py-4">
        {#each navItems as item}
          {#if item.children}
            {#each item.children as child}
              <a href={child.href} onclick={closeMobile} class="rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-cyan-300">
                {child.label}
              </a>
            {/each}
          {:else}
            <a href={item.href} onclick={closeMobile} class="rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-cyan-300">
              {item.label}
            </a>
          {/if}
        {/each}
        <div class="mt-3 flex items-center gap-3 px-1">
          <button class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">EN / VI</button>
          <a href="/login" onclick={closeMobile} class="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white">
            Login / Sign Up
          </a>
        </div>
      </div>
    </div>
  {/if}
</nav>
