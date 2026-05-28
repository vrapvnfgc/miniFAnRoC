<script lang="ts">
  import { Trophy, Medal, Star, Sparkles, FileText } from 'lucide-svelte';
  import * as m from '$lib/paraglide/messages';

  const mainAwards = [
    { title: m.awards_1_title(), subtitle: m.awards_1_subtitle(), desc: m.awards_1_desc(), icon: Trophy, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/10', border: 'border-yellow-400/30 dark:border-yellow-500/20' },
    { title: m.awards_2_title(), subtitle: m.awards_2_subtitle(), desc: m.awards_2_desc(), icon: Medal, color: 'text-slate-500 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-500/10', border: 'border-slate-300 dark:border-slate-500/20' },
    { title: m.awards_3_title(), subtitle: m.awards_3_subtitle(), desc: m.awards_3_desc(), icon: Sparkles, color: 'text-amber-600 dark:text-amber-500', bg: 'bg-amber-50 dark:bg-amber-700/10', border: 'border-amber-400/30 dark:border-amber-700/20' },
    { title: m.awards_4_title(), subtitle: m.awards_4_subtitle(), desc: m.awards_4_desc(), icon: Star, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10', border: 'border-cyan-400/30 dark:border-cyan-500/20' },
  ];

  const specialAwards = [
    { title: m.awards_special_1(), desc: m.awards_special_1_desc() },
    { title: m.awards_special_2(), desc: m.awards_special_2_desc() },
    { title: m.awards_special_3(), desc: m.awards_special_3_desc() },
    { title: m.awards_special_4(), desc: m.awards_special_4_desc() },
    { title: m.awards_special_5(), desc: m.awards_special_5_desc() },
    { title: m.awards_special_6(), desc: m.awards_special_6_desc() },
  ];
</script>

<section class="px-6 py-28 bg-slate-50 dark:bg-slate-900/40">
  <div class="mx-auto max-w-7xl">
    <div class="mb-16 text-center">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{m.awards_label()}</p>
      <h2 class="text-4xl font-black text-slate-900 dark:text-white">{m.awards_title()}</h2>
      <p class="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">{m.awards_desc()}</p>
    </div>

    <!-- Grand Award -->
    <div class="mb-10 relative overflow-hidden rounded-[36px] border border-yellow-400/30 dark:border-yellow-500/25 bg-gradient-to-br from-yellow-50 dark:from-yellow-500/10 via-orange-50 dark:via-orange-500/5 to-amber-50 dark:to-amber-500/10 p-10 shadow-sm dark:shadow-none">
      <div class="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none"></div>
      <div class="relative flex flex-col gap-8 lg:flex-row lg:items-center">
        <div class="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] border border-yellow-400/30 dark:border-yellow-500/30 bg-yellow-100 dark:bg-yellow-500/10 shadow-xl shadow-yellow-500/10">
          <Trophy class="h-12 w-12 text-yellow-600 dark:text-yellow-300" />
        </div>
        <div class="flex-1">
          <div class="mb-2 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 dark:border-yellow-500/25 bg-yellow-100 dark:bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-400 uppercase tracking-wider">🏆 {m.awards_grand_label()}</div>
          <h3 class="mb-3 text-3xl font-black text-slate-900 dark:text-yellow-100 md:text-4xl">{m.awards_grand_title()}</h3>
          <p class="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {m.awards_grand_desc()}
          </p>
          <div class="mt-4 inline-flex items-center gap-2 rounded-2xl border border-dashed border-yellow-400/30 dark:border-yellow-400/20 bg-yellow-50 dark:bg-yellow-500/5 px-5 py-3 text-sm text-yellow-700 dark:text-yellow-300">
            🎁 Prize: REV Robotics FTC Starter Kit + <span class="ml-1 opacity-50">[ Cash prize TBA ]</span>
          </div>
        </div>
        <div class="flex shrink-0 gap-3 lg:flex-col">
          <a href="/awards" class="inline-flex items-center gap-2 rounded-2xl bg-yellow-100 dark:bg-yellow-500/15 border border-yellow-400/30 dark:border-yellow-500/30 px-5 py-3 text-sm font-semibold text-yellow-700 dark:text-yellow-300 transition hover:bg-yellow-200 dark:hover:bg-yellow-500/25">
            <FileText class="h-4 w-4" /> Award Report
          </a>
          <a href="/awards/guide" class="inline-flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/10">Explanation Guide</a>
        </div>
      </div>
    </div>

    <!-- Main Awards -->
    <h3 class="mb-6 text-xl font-bold text-slate-700 dark:text-slate-300">{m.awards_main_title()}</h3>
    <div class="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {#each mainAwards as award}
        {@const Icon = award.icon}
        <div class="rounded-[24px] border {award.border} {award.bg} p-6 shadow-sm dark:shadow-none transition hover:-translate-y-1 hover:shadow-md dark:hover:shadow-none">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
            <Icon class="h-6 w-6 {award.color}" />
          </div>
          <p class="mb-1 text-xs font-semibold {award.color} uppercase tracking-wider">{award.subtitle}</p>
          <h4 class="mb-3 text-base font-bold text-slate-900 dark:text-white">{award.title}</h4>
          <p class="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{award.desc}</p>
          <div class="rounded-xl border border-dashed border-slate-300 dark:border-white/10 px-4 py-2.5 text-xs text-slate-400 dark:text-slate-600">Prize: [ TBA ]</div>
        </div>
      {/each}
    </div>

    <!-- Special Awards -->
    <h3 class="mb-6 text-xl font-bold text-slate-700 dark:text-slate-300">{m.awards_special_title()}</h3>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each specialAwards as award}
        <div class="rounded-[24px] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-6 shadow-sm dark:shadow-none transition hover:-translate-y-1 hover:border-slate-300 dark:hover:border-white/20">
          <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5">
            <Medal class="h-5 w-5 text-slate-500 dark:text-slate-400" />
          </div>
          <h4 class="mb-2 font-bold text-slate-900 dark:text-white">{award.title}</h4>
          <p class="text-sm leading-6 text-slate-500 dark:text-slate-500">{award.desc}</p>
          <div class="mt-4 rounded-xl border border-dashed border-slate-300 dark:border-white/10 px-4 py-2 text-xs text-slate-400 dark:text-slate-600">Prize: [ TBA ]</div>
        </div>
      {/each}
    </div>
  </div>
</section>
