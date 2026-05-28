<script lang="ts">
  import { Clock, MapPin, ArrowRight, Zap } from 'lucide-svelte';
  import * as m from '$lib/paraglide/messages';

  const recentMatches = [
    { id: 'QF-01', teamA: 'Team Volt',  teamB: 'Team Helix', scoreA: 142, scoreB: 118, region: 'Hanoi Regional',   time: '08:30 AM', result: 'red'  },
    { id: 'QF-02', teamA: 'Team Axiom', teamB: 'Team Pulse', scoreA: 96,  scoreB: 130, region: 'Da Nang Regional', time: '09:00 AM', result: 'blue' },
  ];

  const upcomingMatches = [
    { id: 'QF-03', teamA: 'Team Alpha',   teamB: 'Team Nova',  region: 'Hanoi Regional',   time: '09:30 AM', date: 'Sep 14' },
    { id: 'QF-04', teamA: 'Team Phoenix', teamB: 'Team Orbit', region: 'Da Nang Regional', time: '10:15 AM', date: 'Sep 14' },
    { id: 'QF-05', teamA: 'Team Nexus',   teamB: 'Team Spark', region: 'Can Tho Regional', time: '11:00 AM', date: 'Sep 14' },
  ];
</script>

<section class="px-6 py-28">
  <div class="mx-auto max-w-7xl">
    <div class="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div>
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{m.matches_label()}</p>
        <h2 class="text-4xl font-black text-slate-900 dark:text-white">{m.matches_title()}</h2>
      </div>
      <a href="/matches" class="group inline-flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/10">
        {m.btn_view_all_matches()} <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </a>
    </div>

    <!-- Recent -->
    <h3 class="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{m.matches_recent_results()}</h3>
    <div class="mb-10 grid gap-4 md:grid-cols-2">
      {#each recentMatches as match}
        <div class="rounded-[24px] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-6 shadow-sm dark:shadow-none">
          <div class="mb-4 flex items-center justify-between">
            <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-mono text-slate-500 dark:text-slate-400">{match.id}</span>
            <div class="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin class="h-3.5 w-3.5" />{match.region}
            </div>
          </div>
          <div class="flex items-center justify-between gap-4">
            <div class="text-right flex-1">
              <p class="font-bold {match.result === 'red' ? 'text-green-600 dark:text-green-400' : 'text-slate-700 dark:text-white'}">{match.teamA}</p>
              <p class="text-3xl font-black {match.result === 'red' ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}">{match.scoreA}</p>
            </div>
            <div class="text-center shrink-0">
              <div class="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1.5">
                <p class="text-xs text-slate-400">FINAL</p>
                <p class="text-lg font-black text-slate-600 dark:text-white">VS</p>
              </div>
            </div>
            <div class="flex-1">
              <p class="font-bold {match.result === 'blue' ? 'text-green-600 dark:text-green-400' : 'text-slate-700 dark:text-white'}">{match.teamB}</p>
              <p class="text-3xl font-black {match.result === 'blue' ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}">{match.scoreB}</p>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <Clock class="h-3.5 w-3.5" />{match.time}
          </div>
        </div>
      {/each}
    </div>

    <!-- Upcoming -->
    <h3 class="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{m.matches_upcoming()}</h3>
    <div class="grid gap-5 lg:grid-cols-3">
      {#each upcomingMatches as match}
        <div class="rounded-[24px] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-6 shadow-sm dark:shadow-none transition hover:-translate-y-1 hover:border-slate-300 dark:hover:border-white/20">
          <div class="mb-5 flex items-center justify-between">
            <div class="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-500/15 px-3 py-1.5 text-xs font-semibold text-green-700 dark:text-green-400">
              <Zap class="h-3 w-3" /> Upcoming
            </div>
            <span class="font-mono text-sm text-slate-400">{match.id}</span>
          </div>
          <div class="mb-5 flex items-center justify-between gap-2 text-center">
            <div class="flex-1">
              <div class="mb-2 flex h-10 w-10 mx-auto items-center justify-center rounded-xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10">
                <span class="text-xs font-bold text-red-600 dark:text-red-400">RED</span>
              </div>
              <p class="text-sm font-bold text-slate-800 dark:text-white">{match.teamA}</p>
            </div>
            <div class="text-lg font-black text-slate-300 dark:text-slate-600">VS</div>
            <div class="flex-1">
              <div class="mb-2 flex h-10 w-10 mx-auto items-center justify-center rounded-xl border border-blue-300 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10">
                <span class="text-xs font-bold text-blue-600 dark:text-blue-400">BLU</span>
              </div>
              <p class="text-sm font-bold text-slate-800 dark:text-white">{match.teamB}</p>
            </div>
          </div>
          <div class="space-y-2 border-t border-slate-100 dark:border-white/5 pt-4 text-xs text-slate-400">
            <div class="flex items-center gap-1.5"><MapPin class="h-3.5 w-3.5" />{match.region}</div>
            <div class="flex items-center gap-1.5"><Clock class="h-3.5 w-3.5" />{match.date} · {match.time}</div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
