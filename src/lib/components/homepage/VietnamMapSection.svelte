<script lang="ts">
  let hoveredRegion = $state<string | null>(null);

  const regions = [
    {
      id: 'hanoi',
      name: 'Hanoi Regional Hub',
      subtitle: 'Northern Vietnam',
      venue: 'FSchool Hanoi',
      color: '#0ea5e9',     // blue
      bgClass: 'border-blue-500/25 bg-blue-500/10',
      labelClass: 'text-blue-300',
      tooltip: 'Competes at FSchool Hanoi'
    },
    {
      id: 'thanhhoa',
      name: 'Thanh Hoa Regional Hub',
      subtitle: 'Thanh Hoa · Nghe An · Ha Tinh',
      venue: 'FSchool Thanh Hoa',
      color: '#f97316',     // orange
      bgClass: 'border-orange-500/25 bg-orange-500/10',
      labelClass: 'text-orange-300',
      tooltip: 'Competes at FSchool Thanh Hoa'
    },
    {
      id: 'danang',
      name: 'Da Nang Regional Hub',
      subtitle: 'Central Vietnam',
      venue: 'FSchool Da Nang',
      color: '#a855f7',     // purple
      bgClass: 'border-purple-500/25 bg-purple-500/10',
      labelClass: 'text-purple-300',
      tooltip: 'Competes at FSchool Da Nang'
    },
    {
      id: 'cantho',
      name: 'Can Tho Regional Hub',
      subtitle: 'Southern Vietnam',
      venue: 'FSchool Can Tho',
      color: '#22c55e',     // green
      bgClass: 'border-green-500/25 bg-green-500/10',
      labelClass: 'text-green-300',
      tooltip: 'Competes at FSchool Can Tho'
    }
  ];
</script>

<section class="px-6 py-28">
  <div class="mx-auto max-w-7xl">
    <div class="mb-14 text-center">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Regional Competition Hubs</p>
      <h2 class="text-4xl font-black">Where Teams Compete</h2>
      <p class="mx-auto mt-4 max-w-2xl text-slate-400">
        Four regional hubs across Vietnam, bringing the competition close to every student.
      </p>
    </div>

    <div class="grid gap-8 lg:grid-cols-2 items-start">
      <!-- Map placeholder — replace with real SVG Vietnam map -->
      <div class="rounded-[32px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
        <div class="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-white/10 bg-slate-900/60">

          <!-- Stylized placeholder map with color zones -->
          <svg viewBox="0 0 300 600" class="h-full max-h-[480px] w-auto" xmlns="http://www.w3.org/2000/svg">
            <!-- North (Hanoi - blue) -->
            <rect x="60" y="20" width="160" height="140" rx="16" fill="#0ea5e920" stroke="#0ea5e950" stroke-width="1.5"
              class="cursor-pointer transition-all"
              style={hoveredRegion === 'hanoi' ? 'fill:#0ea5e940' : ''}
              onmouseenter={() => hoveredRegion = 'hanoi'}
              onmouseleave={() => hoveredRegion = null}
            />
            <text x="140" y="80" text-anchor="middle" fill="#7dd3fc" font-size="10" font-weight="600">Northern VN</text>
            <text x="140" y="96" text-anchor="middle" fill="#38bdf8" font-size="9">FSchool Hanoi</text>
            <circle cx="140" cy="115" r="5" fill="#0ea5e9" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
            </circle>

            <!-- Thanh Hoa (orange) -->
            <rect x="70" y="175" width="140" height="90" rx="14" fill="#f9731620" stroke="#f9731650" stroke-width="1.5"
              class="cursor-pointer transition-all"
              style={hoveredRegion === 'thanhhoa' ? 'fill:#f9731640' : ''}
              onmouseenter={() => hoveredRegion = 'thanhhoa'}
              onmouseleave={() => hoveredRegion = null}
            />
            <text x="140" y="213" text-anchor="middle" fill="#fdba74" font-size="9" font-weight="600">Thanh Hoa · Nghe An</text>
            <text x="140" y="228" text-anchor="middle" fill="#fb923c" font-size="8">FSchool Thanh Hoa</text>
            <circle cx="140" cy="245" r="4" fill="#f97316" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.2s" repeatCount="indefinite"/>
            </circle>

            <!-- Da Nang (purple) -->
            <rect x="65" y="280" width="150" height="110" rx="14" fill="#a855f720" stroke="#a855f750" stroke-width="1.5"
              class="cursor-pointer transition-all"
              style={hoveredRegion === 'danang' ? 'fill:#a855f740' : ''}
              onmouseenter={() => hoveredRegion = 'danang'}
              onmouseleave={() => hoveredRegion = null}
            />
            <text x="140" y="325" text-anchor="middle" fill="#d8b4fe" font-size="9" font-weight="600">Central Vietnam</text>
            <text x="140" y="340" text-anchor="middle" fill="#c084fc" font-size="8">FSchool Da Nang</text>
            <circle cx="140" cy="360" r="4" fill="#a855f7" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.8s" repeatCount="indefinite"/>
            </circle>

            <!-- South (Can Tho - green) -->
            <rect x="55" y="410" width="170" height="140" rx="16" fill="#22c55e20" stroke="#22c55e50" stroke-width="1.5"
              class="cursor-pointer transition-all"
              style={hoveredRegion === 'cantho' ? 'fill:#22c55e40' : ''}
              onmouseenter={() => hoveredRegion = 'cantho'}
              onmouseleave={() => hoveredRegion = null}
            />
            <text x="140" y="470" text-anchor="middle" fill="#86efac" font-size="10" font-weight="600">Southern VN</text>
            <text x="140" y="486" text-anchor="middle" fill="#4ade80" font-size="9">FSchool Can Tho</text>
            <circle cx="140" cy="510" r="5" fill="#22c55e" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.5s" repeatCount="indefinite"/>
            </circle>

            <!-- VN label -->
            <text x="140" y="580" text-anchor="middle" fill="#475569" font-size="8">
              [ Replace with real SVG map ]
            </text>
          </svg>

          <!-- Tooltip -->
          {#if hoveredRegion}
            {@const region = regions.find(r => r.id === hoveredRegion)}
            {#if region}
              <div class="absolute top-4 left-1/2 -translate-x-1/2 rounded-xl border border-white/15 bg-slate-950/90 px-4 py-2 text-center text-sm backdrop-blur-sm pointer-events-none">
                <p class="font-semibold {region.labelClass}">{region.venue}</p>
                <p class="text-xs text-slate-400">{region.tooltip}</p>
              </div>
            {/if}
          {/if}
        </div>
      </div>

      <!-- Region legend cards -->
      <div class="space-y-4">
        {#each regions as r}
          <button
            class="w-full text-left rounded-[24px] border {r.bgClass} p-6 transition duration-200 hover:-translate-x-1 hover:shadow-lg focus:outline-none"
            style={hoveredRegion === r.id ? 'box-shadow: 0 0 0 1px ' + r.color + '40' : ''}
            onmouseenter={() => hoveredRegion = r.id}
            onmouseleave={() => hoveredRegion = null}
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="mb-1 text-lg font-bold {r.labelClass}">{r.name}</h3>
                <p class="text-sm text-slate-400">{r.subtitle}</p>
              </div>
              <div class="h-3 w-3 mt-1.5 shrink-0 rounded-full" style="background:{r.color}; box-shadow: 0 0 10px {r.color}80"></div>
            </div>
            <p class="mt-3 text-sm text-slate-500">{r.tooltip}</p>
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>
