<script lang="ts">
  import { Trophy, Medal, Star, Sparkles, ArrowRight, FileText } from 'lucide-svelte';
  import type { Component } from 'svelte';

  type MainAward = {
    title: string;
    subtitle: string;
    desc: string;
    icon: Component<{ class?: string }>;
    color: string;
    bg: string;
    border: string;
  };

  const mainAwards: MainAward[] = [
    {
      title: 'FAnRoC Excellence Award', subtitle: 'Champion',
      desc: 'Presented to the overall champion team of the national finals.',
      icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20',
    },
    {
      title: 'Outstanding Award', subtitle: 'Runner-up',
      desc: 'Awarded to the runner-up team demonstrating excellence throughout the competition.',
      icon: Medal, color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/20',
    },
    {
      title: 'Innovation Award', subtitle: 'Third Place',
      desc: 'Recognizes the team with the most creative and innovative robot design.',
      icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-700/10', border: 'border-amber-700/20',
    },
    {
      title: 'Rising Star Award', subtitle: 'Honorable Mention · 3 teams per division',
      desc: 'Celebrates outstanding newcomers who show exceptional promise and growth.',
      icon: Star, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20',
    },
  ];

  const specialAwards = [
    { title: 'Team Sustainability Award', desc: 'Awarded to the team demonstrating the most sustainable engineering practices.' },
    { title: 'Gracious Professionalism Award', desc: 'Recognizes teams that embody the spirit of gracious professionalism on and off the field.' },
    { title: 'Open Tech Award', desc: 'For the team making the best use of open-source technologies in their robot design.' },
    { title: 'Engineering Innovation Award', desc: 'Highlights groundbreaking engineering solutions and novel technical approaches.' },
    { title: 'Engineering Design Award', desc: 'Honors the best overall robot design considering functionality and aesthetics.' },
    { title: 'Engineering Document Award', desc: 'Recognizes the most thorough and professional technical documentation.' },
  ];
</script>

<section class="px-6 py-28">
  <div class="mx-auto max-w-7xl">
    <div class="mb-16 text-center">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Awards</p>
      <h2 class="text-4xl font-black">National Finals Award Structure</h2>
      <p class="mx-auto mt-4 max-w-2xl text-slate-400">
        Recognizing excellence, innovation, and the spirit of engineering across all divisions.
      </p>
    </div>

    <!-- Grand Award -->
    <div class="mb-10 relative overflow-hidden rounded-[36px] border border-yellow-500/25 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-amber-500/10 p-10">
      <div class="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"></div>
      <div class="relative flex flex-col gap-8 lg:flex-row lg:items-center">
        <div class="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] border border-yellow-500/30 bg-yellow-500/10 shadow-2xl shadow-yellow-500/20">
          <Trophy class="h-12 w-12 text-yellow-300" />
        </div>
        <div class="flex-1">
          <div class="mb-2 inline-flex items-center gap-2 rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400 uppercase tracking-wider">
            🏆 Grand Award
          </div>
          <h3 class="mb-3 text-3xl font-black text-yellow-100 md:text-4xl">
            Seymour Papert Inspirer Award
          </h3>
          <p class="max-w-2xl text-lg leading-8 text-slate-300">
            Presented to the most outstanding team in the entire competition — across both divisions. Includes a REV Robotics FTC Starter Kit.
          </p>
          <div class="mt-4 inline-flex items-center gap-2 rounded-2xl border border-dashed border-yellow-400/20 bg-yellow-500/5 px-5 py-3 text-sm text-yellow-300">
            🎁 Prize: REV Robotics FTC Starter Kit + <span class="ml-1 opacity-50">[ Cash prize TBA ]</span>
          </div>
        </div>
        <div class="flex shrink-0 gap-3 lg:flex-col">
          <a href="/awards" class="inline-flex items-center gap-2 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 px-5 py-3 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-500/25">
            <FileText class="h-4 w-4" />
            Award Report
          </a>
          <a href="/awards/guide" class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Explanation Guide
          </a>
        </div>
      </div>
    </div>

    <!-- Main Awards -->
    <h3 class="mb-6 text-xl font-bold text-slate-300">Main Awards</h3>
    <div class="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {#each mainAwards as award}
        {@const Icon = award.icon}
        <div class="rounded-[24px] border {award.border} {award.bg} p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
            <Icon class="h-6 w-6 {award.color}" />
          </div>
          <p class="mb-1 text-xs font-semibold {award.color} uppercase tracking-wider">{award.subtitle}</p>
          <h4 class="mb-3 text-base font-bold text-white">{award.title}</h4>
          <p class="mb-4 text-sm leading-6 text-slate-400">{award.desc}</p>
          <div class="rounded-xl border border-dashed border-white/10 px-4 py-2.5 text-xs text-slate-600">
            Prize: [ TBA ]
          </div>
        </div>
      {/each}
    </div>

    <!-- Special Awards -->
    <h3 class="mb-6 text-xl font-bold text-slate-300">Special Awards</h3>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each specialAwards as award}
        <div class="rounded-[24px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20">
          <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
            <Medal class="h-5 w-5 text-slate-400" />
          </div>
          <h4 class="mb-2 font-bold text-white">{award.title}</h4>
          <p class="text-sm leading-6 text-slate-500">{award.desc}</p>
          <div class="mt-4 rounded-xl border border-dashed border-white/10 px-4 py-2 text-xs text-slate-600">
            Prize: [ TBA ]
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
