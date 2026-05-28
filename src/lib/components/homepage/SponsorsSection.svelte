<script lang="ts">
  import * as m from '$lib/paraglide/messages';

  const sponsors = [
    { name: 'FPT Corporation', role: m.sponsor_main_organizer() },
    { name: 'FSchool',         role: m.sponsor_host_organization() },
    { name: 'REV Robotics',    role: m.sponsor_equipment_partner() },
    { name: 'Sponsor 4',       role: m.sponsor_title_sponsor() },
    { name: 'Sponsor 5',       role: m.sponsor_supporting_sponsor() },
    { name: 'Sponsor 6',       role: m.sponsor_technology_partner() },
  ];
  const marqueeSponsors = [...sponsors, ...sponsors];
</script>

<style>
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .marquee-track { animation: marquee 24s linear infinite; }
  .marquee-track:hover { animation-play-state: paused; }
</style>

<section class="px-6 py-24 bg-slate-50 dark:bg-slate-900/40">
  <div class="mx-auto max-w-7xl">
    <div class="mb-12 text-center">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{m.sponsors_label()}</p>
      <h2 class="text-4xl font-black text-slate-900 dark:text-white">{m.sponsors_title()}</h2>
      <p class="mt-4 text-slate-500 dark:text-slate-400">{m.sponsors_desc()}</p>
    </div>

    <div class="overflow-hidden rounded-[32px] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.01] py-8">
      <div class="flex marquee-track gap-6" style="width: max-content">
        {#each marqueeSponsors as sponsor}
          <div class="flex h-28 w-48 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] px-6 transition hover:border-slate-400 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/[0.04]">
            <!-- IMAGE SLOT: replace with <img src="..." alt="{sponsor.name}" class="h-10 object-contain"> -->
            <div class="h-10 w-24 rounded-lg border border-dashed border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 flex items-center justify-center">
              <span class="text-[10px] text-slate-400 dark:text-slate-600 text-center px-2">{sponsor.name}</span>
            </div>
            <p class="text-xs text-slate-400 dark:text-slate-600 text-center">{sponsor.role}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
