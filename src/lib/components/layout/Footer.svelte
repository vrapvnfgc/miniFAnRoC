<script lang="ts">
  import { Mail, Phone, Share2, Heart, Music, ExternalLink, Bot } from 'lucide-svelte';
  import type { Component } from 'svelte';

  const quickLinks = [
    { label: 'Team List', href: '/teams' },
    { label: 'Team Ranking', href: '/ranking' },
    { label: 'Matches', href: '/matches' },
    { label: 'Awards', href: '/awards' },
    { label: 'Competition Manual', href: '/manual' },
    { label: 'Team Guide Resources', href: '/resources' },
  ];

  type Social = { icon: Component<{ class?: string }>; href: string; label: string };

  const socials: Social[] = [
    { icon: Share2,    href: '#', label: 'Facebook'  },
    { icon: Heart,     href: '#', label: 'Instagram' },
    { icon: Music,     href: '#', label: 'Youtube'   },
  ];
</script>

<footer class="relative border-t border-white/10 bg-slate-950 text-white overflow-hidden">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.06),transparent_50%)] pointer-events-none"></div>

  <div class="relative mx-auto max-w-7xl px-6 pt-16 pb-8">
    <div class="grid gap-12 lg:grid-cols-4 md:grid-cols-2">

      <!-- Brand -->
      <div class="lg:col-span-1">
        <div class="flex items-center gap-3 mb-5">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
            <Bot class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="font-bold text-white">miniFAnRoC</p>
            <p class="text-[10px] text-cyan-400">FAnRoC Platform</p>
          </div>
        </div>
        <p class="text-sm leading-6 text-slate-400">
          Official operation platform for the FSchool AI and Robotics Challenge — Vietnam's nationwide STEM competition.
        </p>
        <p class="mt-4 text-xs text-slate-600">Organized by FPT & FSchool</p>
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">Quick Links</h3>
        <div class="flex flex-col gap-3">
          {#each quickLinks as link}
            <a href={link.href} class="text-sm text-slate-400 transition hover:text-cyan-300 hover:translate-x-0.5 inline-flex items-center gap-1.5 w-fit">
              {link.label}
            </a>
          {/each}
        </div>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">Contact</h3>
        <div class="space-y-4">
          <a href="mailto:fanroc@fschool.edu.vn" class="flex items-center gap-3 text-sm text-slate-400 transition hover:text-cyan-300">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
              <Mail class="h-4 w-4" />
            </div>
            fanroc@fschool.edu.vn
          </a>
          <a href="tel:0123456789" class="flex items-center gap-3 text-sm text-slate-400 transition hover:text-cyan-300">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
              <Phone class="h-4 w-4" />
            </div>
            0123 456 789
          </a>
        </div>

        <!-- Social -->
        <h3 class="mt-8 mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Follow Us</h3>
        <div class="flex gap-3">
          {#each socials as s}
            {@const Icon = s.icon}
            <a
              href={s.href}
              aria-label={s.label}
              class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              <Icon class="h-4 w-4" />
            </a>
          {/each}
        </div>
      </div>

      <!-- About org -->
      <div>
        <h3 class="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">About FAnRoC</h3>
        <p class="text-sm leading-6 text-slate-400 mb-4">
          FSchool AI and Robotics Challenge is a nationwide STEM, AI and Robotics competition for middle school students across Vietnam.
        </p>
        <a href="/manual" class="inline-flex items-center gap-1.5 text-sm text-cyan-400 transition hover:text-cyan-300">
          Competition Manual
          <ExternalLink class="h-3.5 w-3.5" />
        </a>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
      <p class="text-xs text-slate-600">
        © 2026 miniFAnRoC • Organized by FPT Corporation & FSchool
      </p>
      <div class="flex items-center gap-4 text-xs text-slate-600">
        <a href="/privacy" class="hover:text-slate-400 transition">Privacy Policy</a>
        <a href="/terms" class="hover:text-slate-400 transition">Terms of Use</a>
      </div>
    </div>
  </div>
</footer>
