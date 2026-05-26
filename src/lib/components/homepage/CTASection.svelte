<script lang="ts">
  import { ArrowRight, UserPlus } from 'lucide-svelte';
</script>

<section class="px-6 py-24">
  <div class="mx-auto max-w-6xl">
    <div class="relative overflow-hidden rounded-[40px] border border-white/10 p-12 md:p-20 text-center">
      <!-- Background layers -->
      <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(14,165,233,0.15),transparent)]"></div>
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <!-- Glow orbs -->
      <div class="absolute top-0 left-1/4 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"></div>

      <div class="relative">
        <p class="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Join The Movement</p>
        <h2 class="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
          Build The Future<br/>
          <span class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            With Robotics & AI
          </span>
        </h2>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Join Vietnam's next generation of innovators, engineers and technology leaders.
          Register your team today and compete on the national stage.
        </p>

        <div class="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="/signup"
            class="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-xl shadow-cyan-500/25 transition hover:scale-105 hover:shadow-cyan-500/40"
          >
            <UserPlus class="h-5 w-5" />
            Sign Up
          </a>
          <a
            href="/register"
            class="group inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/30"
          >
            Register Team
            <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
