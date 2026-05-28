<script lang="ts">
  import { Rocket, Brain, Cpu, Users } from 'lucide-svelte';
  import * as m from '$lib/paraglide/messages';

  const objectives = [
    { icon: Rocket, title: m.about_objective_1_title(),    desc: m.about_objective_1_desc(),              gradFrom: 'from-cyan-500/20',   gradTo: 'to-cyan-600/5',   border: 'border-cyan-500/20',   iconBg: 'bg-cyan-500/10',   iconColor: 'text-cyan-600 dark:text-cyan-400'   },
    { icon: Brain,  title: m.about_objective_2_title(),     desc: m.about_objective_2_desc(),                 gradFrom: 'from-blue-500/20',   gradTo: 'to-blue-600/5',   border: 'border-blue-500/20',   iconBg: 'bg-blue-500/10',   iconColor: 'text-blue-600 dark:text-blue-400'   },
    { icon: Cpu,    title: m.about_objective_3_title(),    desc: m.about_objective_3_desc(),            gradFrom: 'from-purple-500/20', gradTo: 'to-purple-600/5', border: 'border-purple-500/20', iconBg: 'bg-purple-500/10', iconColor: 'text-purple-600 dark:text-purple-400' },
    { icon: Users,  title: m.about_objective_4_title(),      desc: m.about_objective_4_desc(),            gradFrom: 'from-emerald-500/20',gradTo: 'to-emerald-600/5',border: 'border-emerald-500/20',iconBg: 'bg-emerald-500/10',iconColor: 'text-emerald-600 dark:text-emerald-400'},
  ];
</script>

<section id="about" class="px-6 py-32">
  <div class="mx-auto max-w-7xl">
    <div class="mb-16 text-center">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{m.about_label()}</p>
      <h2 class="text-4xl font-black text-slate-900 dark:text-white md:text-5xl">
        {m.about_title()}
      </h2>
      <p class="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
        {m.about_desc()}
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
        <h3 class="text-2xl font-black text-slate-900 dark:text-white">{m.about_competition_moments()}</h3>
        <p class="text-sm text-slate-400 dark:text-slate-500">{m.about_gallery_placeholder()}</p>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        {#each [1, 2, 3] as i}
          <div class="h-64 overflow-hidden rounded-[24px] border border-dashed border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/[0.02] flex items-center justify-center transition hover:border-slate-400 dark:hover:border-white/20">
            <div class="text-center select-none pointer-events-none">
              <div class="mx-auto mb-2 h-8 w-8 rounded-lg border border-dashed border-slate-300 dark:border-white/20 flex items-center justify-center">
                <span class="text-xs text-slate-400 dark:text-slate-600">{i}</span>
              </div>
              <p class="text-xs text-slate-400 dark:text-slate-600">{m.about_gallery_image_label({ i })}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
