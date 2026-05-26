<script lang="ts">
  import { Rocket, Brain, Cpu, Users } from 'lucide-svelte';
  import type { Component } from 'svelte';

  type Objective = {
    icon: Component<{ class?: string }>;
    title: string;
    desc: string;
    color: string;
    border: string;
    iconColor: string;
    iconBg: string;
  };

  const objectives: Objective[] = [
    {
      icon: Rocket,
      title: 'Inspire STEM Passion',
      desc: 'Encouraging students to explore the wonders of science, technology and robotics.',
      color: 'from-cyan-500/20 to-cyan-600/5',
      border: 'border-cyan-500/20',
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10'
    },
    {
      icon: Brain,
      title: 'Promote AI Literacy',
      desc: 'Helping the next generation understand and apply AI technologies in real life.',
      color: 'from-blue-500/20 to-blue-600/5',
      border: 'border-blue-500/20',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10'
    },
    {
      icon: Cpu,
      title: 'Engineering Thinking',
      desc: 'Building strong engineering and problem-solving mindset through hands-on challenges.',
      color: 'from-purple-500/20 to-purple-600/5',
      border: 'border-purple-500/20',
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      desc: 'Developing teamwork, leadership and communication skills under competitive pressure.',
      color: 'from-emerald-500/20 to-emerald-600/5',
      border: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10'
    }
  ];
</script>

<section id="about" class="px-6 py-32">
  <div class="mx-auto max-w-7xl">
    <!-- Section header -->
    <div class="mb-16 text-center">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">About The Competition</p>
      <h2 class="text-4xl font-black md:text-5xl">
        Building Vietnam's<br/>
        <span class="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Future Innovators</span>
      </h2>
      <p class="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
        FAnRoC (FSchool AI and Robotics Challenge) is a nationwide STEM, AI and Robotics competition designed
        for middle school students to develop engineering mindset, teamwork and innovation skills.
      </p>
    </div>

    <!-- Highlight cards -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {#each objectives as obj}
        {@const Icon = obj.icon}
        <div class="group rounded-[28px] border {obj.border} bg-gradient-to-br {obj.color} p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-xl">
          <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl {obj.iconBg} ring-1 ring-white/10">
            <Icon class="h-7 w-7 {obj.iconColor}" />
          </div>
          <h3 class="mb-3 text-lg font-bold text-white">{obj.title}</h3>
          <p class="text-sm leading-6 text-slate-400">{obj.desc}</p>
        </div>
      {/each}
    </div>

    <!-- Image gallery placeholder -->
    <div class="mt-20">
      <div class="mb-8 flex items-center justify-between">
        <h3 class="text-2xl font-black">Competition Moments</h3>
        <p class="text-sm text-slate-500">[ Photo gallery — add images below ]</p>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        {#each [1,2,3] as i}
          <!-- IMAGE SLOT {i} — replace with <img src="..." alt="..." class="..."> -->
          <div class="group relative h-64 overflow-hidden rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center transition hover:border-white/20">
            <div class="text-center select-none pointer-events-none">
              <div class="mx-auto mb-2 h-8 w-8 rounded-lg border border-dashed border-white/20 flex items-center justify-center">
                <span class="text-xs text-slate-600">{i}</span>
              </div>
              <p class="text-xs text-slate-600">[ Competition image {i} ]</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
