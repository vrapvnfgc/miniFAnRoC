<script lang="ts">
  import { ExternalLink, Bot, Share2, AtSign, Rss } from 'lucide-svelte';
  import * as m from '$lib/paraglide/messages';
  import ContactSection from './ContactSection.svelte';

  const quickLinks = [
    { label: m.nav_teams(), href: '/teams' },
    { label: m.nav_ranking(), href: '/ranking' },
    { label: m.nav_matches(), href: '/matches' },
    { label: m.nav_awards(), href: '/awards' },
    { label: m.nav_manual(), href: '/manual' },
    { label: m.nav_resources(), href: '/resources' },
  ];
  const socials = [
    { icon: Share2, href: '#', label: m.social_facebook() },
    { icon: AtSign, href: '#', label: m.social_instagram() },
    { icon: Rss,    href: '#', label: m.social_youtube() },
  ];
</script>

<footer class="relative border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-white overflow-hidden">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.06),transparent_50%)] pointer-events-none"></div>
  <div class="relative mx-auto max-w-7xl px-6 pt-16 pb-8">
    <div class="grid gap-12 lg:grid-cols-4 md:grid-cols-2">

      <!-- Brand -->
      <div>
        <div class="flex items-center gap-3 mb-5">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
            <Bot class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="font-bold text-slate-900 dark:text-white">miniFAnRoC</p>
            <p class="text-[10px] text-cyan-600 dark:text-cyan-400">{m.footer_brand_tag()}</p>
          </div>
        </div>
        <p class="text-sm leading-6 text-slate-500 dark:text-slate-400">{m.footer_brand_desc()}</p>
        <p class="mt-4 text-xs text-slate-400 dark:text-slate-600">{m.footer_organized_by()}</p>
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{m.footer_quick_links()}</h3>
        <div class="flex flex-col gap-3">
          {#each quickLinks as link}
            <a href={link.href} class="text-sm text-slate-500 dark:text-slate-400 transition hover:text-cyan-600 dark:hover:text-cyan-300 w-fit">{link.label}</a>
          {/each}
        </div>
      </div>

      <!-- Contact -->
      <ContactSection socials={socials} />

      <!-- About -->
      <div>
        <h3 class="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{m.about_fanroc_label()}</h3>
        <p class="text-sm leading-6 text-slate-500 dark:text-slate-400 mb-4">{m.footer_about_desc()}</p>
        <a href="/manual" class="inline-flex items-center gap-1.5 text-sm text-cyan-600 dark:text-cyan-400 transition hover:text-cyan-700 dark:hover:text-cyan-300">
          {m.nav_manual()} <ExternalLink class="h-3.5 w-3.5" />
        </a>
      </div>
    </div>

    <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10 pt-6 sm:flex-row">
      <p class="text-xs text-slate-400 dark:text-slate-600">© 2026 miniFAnRoC • Organized by FPT Corporation & FSchool</p>
      <div class="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-600">
        <a href="/privacy" class="hover:text-slate-600 dark:hover:text-slate-400 transition">{m.footer_privacy()}</a>
        <a href="/terms" class="hover:text-slate-600 dark:hover:text-slate-400 transition">{m.footer_terms()}</a>
      </div>
    </div>
  </div>
</footer>
