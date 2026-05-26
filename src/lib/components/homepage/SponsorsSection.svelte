<script lang="ts">
  const sponsors = [
    { name: 'FPT Corporation', role: 'Main Organizer', placeholder: true },
    { name: 'FSchool', role: 'Host Organization', placeholder: true },
    { name: 'REV Robotics', role: 'Equipment Partner', placeholder: true },
    { name: 'Sponsor 4', role: 'Title Sponsor', placeholder: true },
    { name: 'Sponsor 5', role: 'Supporting Sponsor', placeholder: true },
    { name: 'Sponsor 6', role: 'Technology Partner', placeholder: true },
  ];

  // Duplicate for seamless marquee
  const marqueeSponsors = [...sponsors, ...sponsors];
</script>

<style>
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .marquee-track {
    animation: marquee 24s linear infinite;
  }
  .marquee-track:hover {
    animation-play-state: paused;
  }
</style>

<section class="px-6 py-24">
  <div class="mx-auto max-w-7xl">
    <div class="mb-12 text-center">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Organizers & Sponsors</p>
      <h2 class="text-4xl font-black">Powered By Innovation</h2>
      <p class="mt-4 text-slate-400">Organized by FPT Corporation & FSchool. Made possible by our sponsors.</p>
    </div>

    <!-- Marquee -->
    <div class="overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.01] py-8">
      <div class="flex marquee-track gap-6" style="width: max-content">
        {#each marqueeSponsors as sponsor}
          <div class="flex h-28 w-48 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 transition hover:border-white/20 hover:bg-white/[0.04]">
            <!-- IMAGE SLOT: replace with <img src="..." alt="{sponsor.name}" class="h-10 object-contain"> -->
            <div class="h-10 w-24 rounded-lg border border-dashed border-white/15 bg-white/5 flex items-center justify-center">
              <span class="text-[10px] text-slate-600 text-center px-2">{sponsor.name}</span>
            </div>
            <p class="text-xs text-slate-600 text-center">{sponsor.role}</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Static grid for smaller screens fallback -->
    <div class="mt-6 grid grid-cols-3 gap-4 md:grid-cols-6 lg:hidden">
      {#each sponsors as sponsor}
        <div class="flex h-20 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
          <span class="text-xs text-slate-600 text-center px-2">{sponsor.name}</span>
        </div>
      {/each}
    </div>
  </div>
</section>
