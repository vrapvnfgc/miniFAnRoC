<script lang="ts">
  import { Bot, ArrowRight, ChevronDown } from 'lucide-svelte';
  import * as m from '$lib/paraglide/messages';
</script>

<section class="relative flex min-h-screen items-center overflow-hidden px-6">
  <!-- Background: dark keeps gradient glow, light uses subtle version -->
  <div class="absolute inset-0">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.15),transparent)] dark:opacity-100 opacity-40"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.10),transparent_50%)] dark:opacity-100 opacity-30"></div>
    <!-- Grid lines: very subtle in light mode -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
    <div class="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px] animate-pulse dark:bg-cyan-500/10"></div>
    <div class="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] animate-pulse dark:bg-purple-500/10" style="animation-delay:1.5s"></div>
  </div>

  <div class="relative z-10 mx-auto grid max-w-7xl items-center gap-12 pt-20 lg:grid-cols-2 lg:gap-20">
    <div class="order-2 lg:order-1">
      <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-700 dark:text-cyan-300 backdrop-blur-sm">
        <div class="h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></div>
        {m.hero_badge()}
      </div>

      <h1 class="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl xl:text-7xl">
        <span class="text-slate-900 dark:text-white">FSchool AI and</span><br/>
        <span class="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Robotics Challenge
        </span>
      </h1>

      <p class="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
        {m.hero_subtitle()}
      </p>
      <p class="mt-3 max-w-xl text-slate-500 dark:text-slate-500">
        {m.hero_desc()}
      </p>

      <div class="mt-10 flex flex-wrap gap-4">
        <a href="/register"
          class="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-105 hover:shadow-cyan-500/40">
          {m.hero_cta_register()}
          <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
        <a href="#about"
          class="inline-flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-100 dark:bg-white/5 px-7 py-4 font-semibold text-slate-700 dark:text-white backdrop-blur-sm transition hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/25">
          {m.hero_cta_explore()}
        </a>
      </div>

      <div class="mt-12 flex flex-wrap gap-6">
        {#each [['128+','Teams'],['542+','Students'],['27+','Provinces']] as [val, lbl]}
          <div class="text-center">
            <p class="text-2xl font-black text-cyan-600 dark:text-cyan-300">{val}</p>
            <p class="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{lbl}</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Hero image slot -->
    <div class="order-1 lg:order-2">
      <div class="relative">
        <div class="absolute -inset-8 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/15"></div>
        <div class="relative rounded-[32px] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] p-3 shadow-2xl backdrop-blur-xl">
          <!-- IMAGE PLACEHOLDER — replace with <img src="..." alt="..."> -->
          <div class="relative flex h-[440px] items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 lg:h-[520px]">
            <div class="text-center select-none pointer-events-none">
              <Bot class="mx-auto mb-4 h-20 w-20 text-slate-300 dark:text-cyan-400/50" />
              <p class="text-sm text-slate-400 dark:text-slate-600">[ Place hero robot/students image here ]</p>
            </div>
            <div class="absolute top-4 right-4 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]"></div>
            <div class="absolute bottom-4 left-4 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_2px_rgba(192,132,252,0.6)]"></div>
          </div>
          <div class="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] px-5 py-3">
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-500">Competition</p>
              <p class="text-sm font-semibold text-slate-800 dark:text-white">FAnRoC 2026</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-slate-500 dark:text-slate-500">Status</p>
              <p class="text-sm font-semibold text-green-600 dark:text-green-400">Registration Open</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <a href="#about" class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600 transition hover:text-slate-600 dark:hover:text-slate-400" aria-label="Scroll down">
    <span class="text-xs tracking-widest uppercase">Scroll</span>
    <ChevronDown class="h-5 w-5 animate-bounce" />
  </a>
</section>
