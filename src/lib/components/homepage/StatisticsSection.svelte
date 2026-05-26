<script lang="ts">
  import { Trophy, Users, School, Globe2 } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import type { Component } from 'svelte';

  type Stat = {
    icon: Component<{ class?: string }>;
    label: string;
    value: number;
    suffix: string;
    iconColor: string;
    iconBg: string;
    glowColor: string;
  };

  const stats: Stat[] = [
    { icon: Trophy, label: 'Competing Teams',      value: 128, suffix: '+', iconColor: 'text-yellow-400',  iconBg: 'bg-yellow-500/10',  glowColor: 'shadow-yellow-500/10'  },
    { icon: Users,  label: 'Student Participants', value: 542, suffix: '+', iconColor: 'text-cyan-400',    iconBg: 'bg-cyan-500/10',    glowColor: 'shadow-cyan-500/10'    },
    { icon: School, label: 'Schools Registered',   value: 61,  suffix: '+', iconColor: 'text-blue-400',    iconBg: 'bg-blue-500/10',    glowColor: 'shadow-blue-500/10'    },
    { icon: Globe2, label: 'Provinces',             value: 27,  suffix: '+', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10', glowColor: 'shadow-emerald-500/10' },
  ];

  let displayed = $state(stats.map(() => 0));
  let triggered = false;

  onMount(() => {
    const el = document.getElementById('stats-section');
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !triggered) {
        triggered = true;
        stats.forEach((s, i) => {
          const steps = 60;
          const increment = s.value / steps;
          let count = 0;
          const interval = setInterval(() => {
            count += increment;
            if (count >= s.value) {
              displayed[i] = s.value;
              clearInterval(interval);
            } else {
              displayed[i] = Math.floor(count);
            }
          }, 1800 / steps);
        });
      }
    }, { threshold: 0.3 });
    if (el) observer.observe(el);
    return () => observer.disconnect();
  });
</script>

<section id="stats-section" class="px-6 py-28">
  <div class="mx-auto max-w-7xl">
    <div class="mb-12 text-center">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Live Statistics</p>
      <h2 class="text-4xl font-black">Growing Nationwide Community</h2>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {#each stats as s, i}
        {@const Icon = s.icon}
        <div class="group relative rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl {s.glowColor}">
          <div class="absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
               style="background: radial-gradient(circle at 50% 0%, rgba(14,165,233,0.05), transparent 70%)"></div>
          <div class="relative">
            <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl {s.iconBg} ring-1 ring-white/10">
              <Icon class="h-7 w-7 {s.iconColor}" />
            </div>
            <p class="text-5xl font-black {s.iconColor} tabular-nums">{displayed[i]}{s.suffix}</p>
            <p class="mt-2 text-sm text-slate-400">{s.label}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
