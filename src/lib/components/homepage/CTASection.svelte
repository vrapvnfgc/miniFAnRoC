<script lang="ts">
  import { ArrowRight, UserPlus } from 'lucide-svelte';
  import * as m from '$lib/paraglide/messages';
</script>

<section class="px-6 py-24">
  <div class="mx-auto max-w-6xl">
    <div class="relative overflow-hidden rounded-[40px] border border-slate-200 dark:border-white/10 bg-gradient-to-br from-cyan-50 dark:from-cyan-500/10 via-blue-50 dark:via-blue-500/5 to-purple-50 dark:to-purple-500/10 p-12 md:p-20 text-center shadow-sm dark:shadow-none">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(14,165,233,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(14,165,233,0.15),transparent)]"></div>
      <div class="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div class="absolute top-0 left-1/4 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

      <div class="relative">
        <p class="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{m.cta_label()}</p>
        <h2 class="text-4xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
          Build The Future<br/>
          <span class="bg-gradient-to-r from-cyan-500 to-purple-500 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">With Robotics & AI</span>
        </h2>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Join Vietnam's next generation of innovators, engineers and technology leaders.
          Register your team today and compete on the national stage.
        </p>
        <div class="mt-10 flex flex-wrap justify-center gap-4">
          <a href="/signup" class="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-xl shadow-cyan-500/20 transition hover:scale-105 hover:shadow-cyan-500/40">
            <UserPlus class="h-5 w-5" /> Sign Up
          </a>
          <a href="/register" class="group inline-flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-8 py-4 font-semibold text-slate-700 dark:text-white backdrop-blur-sm transition hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/30">
            Register Team <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
