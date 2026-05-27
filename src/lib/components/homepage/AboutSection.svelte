<script lang="ts">
  import { Rocket, Brain, Cpu, Users } from 'lucide-svelte';
  import * as m from '$lib/paraglide/messages';

  const objectives = [
    { icon: Rocket, title: 'Inspire STEM Passion',    desc: 'Encouraging students to explore the wonders of science, technology and robotics.',              gradFrom: 'from-cyan-500/20',   gradTo: 'to-cyan-600/5',   border: 'border-cyan-500/20',   iconBg: 'bg-cyan-500/10',   iconColor: 'text-cyan-600 dark:text-cyan-400'   },
    { icon: Brain,  title: 'Promote AI Literacy',     desc: 'Helping the next generation understand and apply AI technologies in real life.',                 gradFrom: 'from-blue-500/20',   gradTo: 'to-blue-600/5',   border: 'border-blue-500/20',   iconBg: 'bg-blue-500/10',   iconColor: 'text-blue-600 dark:text-blue-400'   },
    { icon: Cpu,    title: 'Engineering Thinking',    desc: 'Building strong engineering and problem-solving mindset through hands-on challenges.',            gradFrom: 'from-purple-500/20', gradTo: 'to-purple-600/5', border: 'border-purple-500/20', iconBg: 'bg-purple-500/10', iconColor: 'text-purple-600 dark:text-purple-400' },
    { icon: Users,  title: 'Team Collaboration',      desc: 'Developing teamwork, leadership and communication skills under competitive pressure.',            gradFrom: 'from-emerald-500/20',gradTo: 'to-emerald-600/5',border: 'border-emerald-500/20',iconBg: 'bg-emerald-500/10',iconColor: 'text-emerald-600 dark:text-emerald-400'},
  ];
</script>

<section id="about" class="px-6 py-32">
  <div class="mx-auto max-w-7xl">
    <div class="mb-16 text-center">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{m.about_label()}</p>
      <h2 class="text-4xl font-black text-slate-900 dark:text-white md:text-5xl">
        Building Vietnam's<br/>
        <span class="bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">Future Innovators</span>
      </h2>
      <p class="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
        FAnRoC (FSchool AI and Robotics Challenge) is a nationwide STEM, AI and Robotics competition designed
        for middle school students to develop engineering mindset, teamwork and innovation skills.
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {#each objectives as obj}
        {@const Icon = obj.icon}
        <div class="group rounded-[28px] border {obj.border} bg-gradient-to-br {obj.gradFrom} {obj.gradTo} p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-xl">
          <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl {obj.iconBg} ring-1 ring-black/5 dark:ring-white/10">
            <Icon class="h-7 w-7 {obj.iconColor}" />
          </div>
          <h3 class="mb-3 text-lg font-bold text-slate-900 dark:text-white">{obj.title}</h3>
          <p class="text-sm leading-6 text-slate-600 dark:text-slate-400">{obj.desc}</p>
        </div>
      {/each}
    </div>

    <!-- Image gallery -->
    <div class="mt-20">
      <div class="mb-8 flex items-center justify-between">
        <h3 class="text-2xl font-black text-slate-900 dark:text-white">Competition Moments</h3>
        <p class="text-sm text-slate-400 dark:text-slate-500">[ Photo gallery — add images below ]</p>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        {#each [1, 2, 3] as i}
          <div class="h-64 overflow-hidden rounded-[24px] border border-dashed border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/[0.02] flex items-center justify-center transition hover:border-slate-400 dark:hover:border-white/20">
            <div class="text-center select-none pointer-events-none">
              <div class="mx-auto mb-2 h-8 w-8 rounded-lg border border-dashed border-slate-300 dark:border-white/20 flex items-center justify-center">
                <span class="text-xs text-slate-400 dark:text-slate-600">{i}</span>
              </div>
              <p class="text-xs text-slate-400 dark:text-slate-600">[ Competition image {i} ]</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
