<script lang="ts">
  import { Bot, ArrowRight, ChevronDown } from 'lucide-svelte';
</script>

<section class="relative flex min-h-screen items-center overflow-hidden px-6">
  <!-- Animated background -->
  <div class="absolute inset-0">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.18),transparent)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.12),transparent_50%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(6,182,212,0.08),transparent_40%)]"></div>
    <!-- Grid -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
    <!-- Glowing orbs -->
    <div class="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px] animate-pulse"></div>
    <div class="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] animate-pulse" style="animation-delay:1.5s"></div>
  </div>

  <div class="relative z-10 mx-auto grid max-w-7xl items-center gap-12 pt-20 lg:grid-cols-2 lg:gap-20">
    <!-- Text content -->
    <div class="order-2 lg:order-1">
      <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 backdrop-blur-sm">
        <div class="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
        Powered by miniFAnRoC Platform
      </div>

      <h1 class="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl xl:text-7xl">
        <span class="text-white">FSchool AI and</span><br/>
        <span class="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Robotics Challenge
        </span>
      </h1>

      <p class="mt-6 max-w-xl text-lg leading-8 text-slate-300">
        A nationwide STEM, AI and Robotics competition for middle school students across Vietnam.
      </p>
      <p class="mt-3 max-w-xl text-slate-500">
        miniFAnRoC is the official operation platform for robotics competition management, match systems and tournament coordination.
      </p>

      <div class="mt-10 flex flex-wrap gap-4">
        <a
          href="/register"
          class="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-105 hover:shadow-cyan-500/40"
        >
          Register Team
          <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
        <a
          href="#about"
          class="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/25"
        >
          Explore Competition
        </a>
      </div>

      <!-- Stats mini row -->
      <div class="mt-12 flex flex-wrap gap-6">
        {#each [['128+','Teams'],['542+','Students'],['27+','Provinces']] as [val, lbl]}
          <div class="text-center">
            <p class="text-2xl font-black text-cyan-300">{val}</p>
            <p class="text-xs text-slate-500 mt-0.5">{lbl}</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Hero image slot -->
    <div class="order-1 lg:order-2">
      <div class="relative">
        <!-- Glow behind card -->
        <div class="absolute -inset-8 rounded-full bg-cyan-500/15 blur-3xl"></div>
        <div class="absolute -inset-8 rounded-full bg-purple-500/10 blur-3xl" style="animation-delay:2s"></div>

        <div class="relative rounded-[32px] border border-white/10 bg-white/[0.03] p-3 shadow-2xl backdrop-blur-xl">
          <!-- IMAGE PLACEHOLDER — replace src with real image -->
          <div class="relative flex h-[440px] items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-white/15 bg-gradient-to-br from-slate-900 to-slate-950 lg:h-[520px]">
            <!-- Placeholder content — swap this entire div with <img src="..." alt="..."> -->
            <div class="text-center select-none pointer-events-none">
              <Bot class="mx-auto mb-4 h-20 w-20 text-cyan-400/50" />
              <p class="text-sm text-slate-600">[ Place hero robot/students image here ]</p>
            </div>
            <!-- Decorative corner accent -->
            <div class="absolute top-4 right-4 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]"></div>
            <div class="absolute bottom-4 left-4 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_2px_rgba(192,132,252,0.6)]"></div>
          </div>

          <!-- Card info bar -->
          <div class="mt-3 flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-3">
            <div>
              <p class="text-xs text-slate-500">Competition</p>
              <p class="text-sm font-semibold text-white">FAnRoC 2026</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-slate-500">Status</p>
              <p class="text-sm font-semibold text-green-400">Registration Open</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll indicator -->
  <a href="#about" class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 transition hover:text-slate-400" aria-label="Scroll down">
    <span class="text-xs tracking-widest uppercase">Scroll</span>
    <ChevronDown class="h-5 w-5 animate-bounce" />
  </a>
</section>
