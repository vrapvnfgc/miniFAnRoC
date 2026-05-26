<script lang="ts">
  import { CalendarDays, ClipboardList, Flag, Trophy } from 'lucide-svelte';
  import type { Component } from 'svelte';

  type TimelineItem = {
    icon: Component<{ class?: string }>;
    date: string;
    title: string;
    desc: string;
    color: string;
    bg: string;
    border: string;
    step: number;
  };

  const timeline: TimelineItem[] = [
    {
      icon: ClipboardList,
      date: 'Aug 10, 2026', title: 'Team Registration',
      desc: 'Register your team online. All required documents must be submitted before the deadline.',
      color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', step: 1
    },
    {
      icon: CalendarDays,
      date: 'Aug 24, 2026', title: 'Training Webinar',
      desc: 'Attend the official online training session to learn competition rules and robot design guidelines.',
      color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', step: 2
    },
    {
      icon: Flag,
      date: 'Sep 14, 2026', title: 'Regional Qualifiers',
      desc: 'Teams compete at regional FSchool hubs in Hanoi, Thanh Hoa, Da Nang and Can Tho.',
      color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', step: 3
    },
    {
      icon: Trophy,
      date: 'Oct 12, 2026', title: 'National Finals',
      desc: 'Top teams from all regions gather at FSchool Hanoi to compete for the national championship.',
      color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', step: 4
    }
  ];
</script>

<section class="px-6 py-28">
  <div class="mx-auto max-w-7xl">
    <div class="mb-16 text-center">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Competition Flow</p>
      <h2 class="text-4xl font-black">How The Competition Works</h2>
      <p class="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-400">
        Teams from across Vietnam will compete at regional hubs at FSchool campuses in Hanoi, Thanh Hoa,
        Da Nang and Can Tho before advancing to the National Finals at FSchool Hanoi.
      </p>
    </div>

    <!-- Desktop timeline (horizontal) -->
    <div class="hidden lg:block">
      <div class="relative mb-8 flex items-center justify-between">
        <div class="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-yellow-500/50"></div>
        {#each timeline as item}
          <div class="relative flex h-10 w-10 items-center justify-center rounded-full border-2 {item.border} {item.bg} z-10">
            <span class="text-sm font-bold {item.color}">{item.step}</span>
          </div>
        {/each}
      </div>
      <div class="grid grid-cols-4 gap-6">
        {#each timeline as item}
          {@const Icon = item.icon}
          <div class="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl {item.bg}">
              <Icon class="h-6 w-6 {item.color}" />
            </div>
            <p class="mb-1 text-xs font-medium {item.color}">{item.date}</p>
            <h3 class="mb-3 text-lg font-bold text-white">{item.title}</h3>
            <p class="text-sm leading-6 text-slate-400">{item.desc}</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Mobile timeline (vertical) -->
    <div class="space-y-0 lg:hidden">
      {#each timeline as item, i}
        {@const Icon = item.icon}
        <div class="relative flex gap-5">
          <div class="flex flex-col items-center">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 {item.border} {item.bg}">
              <span class="text-sm font-bold {item.color}">{item.step}</span>
            </div>
            {#if i < timeline.length - 1}
              <div class="mt-1 w-px flex-1 bg-white/10 mb-1"></div>
            {/if}
          </div>
          <div class="pb-8">
            <div class="mb-2 flex h-8 w-8 items-center justify-center rounded-lg {item.bg}">
              <Icon class="h-4 w-4 {item.color}" />
            </div>
            <p class="text-xs font-medium {item.color} mb-1">{item.date}</p>
            <h3 class="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p class="text-sm leading-6 text-slate-400">{item.desc}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
