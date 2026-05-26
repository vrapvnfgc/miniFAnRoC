<script lang="ts">
  import { ArrowRight, School, Globe } from 'lucide-svelte';
</script>

<section class="px-6 py-20">
  <div class="mx-auto max-w-7xl">
    <div class="mb-14 text-center">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Competition Categories</p>
      <h2 class="text-4xl font-black">Competition Divisions</h2>
      <p class="mx-auto mt-4 max-w-2xl text-slate-400">
        Two divisions — one for FSchool students, one open to all middle schools across Vietnam.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Internal Division -->
      <div class="group relative overflow-hidden rounded-[32px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-10 transition hover:border-cyan-500/40">
        <div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl transition group-hover:bg-cyan-500/20"></div>
        <div class="relative">
          <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 ring-1 ring-cyan-500/30">
            <School class="h-7 w-7 text-cyan-400" />
          </div>
          <p class="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">For FSchool Students</p>
          <h3 class="mb-4 text-3xl font-black text-white">Internal Division</h3>
          <p class="mb-8 text-lg leading-8 text-slate-300">
            Dedicated for FSchool middle school students nationwide. Compete with peers from the same educational ecosystem.
          </p>
          <!-- Image slot -->
          <div class="mb-6 h-32 rounded-2xl border border-dashed border-cyan-500/20 bg-cyan-500/5 flex items-center justify-center">
            <p class="text-xs text-slate-600">[ Internal Division image ]</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <a href="/register" class="group/btn inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400">
              Register Team
              <ArrowRight class="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </a>
            <a href="/manual" class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Competition Manual
            </a>
            <a href="/resources" class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Team Guide
            </a>
          </div>
        </div>
      </div>

      <!-- Open Division -->
      <div class="group relative overflow-hidden rounded-[32px] border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-10 transition hover:border-purple-500/40">
        <div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl transition group-hover:bg-purple-500/20"></div>
        <div class="relative">
          <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/15 ring-1 ring-purple-500/30">
            <Globe class="h-7 w-7 text-purple-400" />
          </div>
          <p class="mb-1 text-xs font-semibold uppercase tracking-wider text-purple-400">Open to All Schools</p>
          <h3 class="mb-4 text-3xl font-black text-white">Open Division</h3>
          <p class="mb-8 text-lg leading-8 text-slate-300">
            Open for all middle school students from any school across Vietnam. Showcase your skills on the national stage.
          </p>
          <!-- Image slot -->
          <div class="mb-6 h-32 rounded-2xl border border-dashed border-purple-500/20 bg-purple-500/5 flex items-center justify-center">
            <p class="text-xs text-slate-600">[ Open Division image ]</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <a href="/register" class="group/btn inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-400">
              Register Team
              <ArrowRight class="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </a>
            <a href="/manual" class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Competition Manual
            </a>
            <a href="/resources" class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Team Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
