<script lang="ts">
  import { Mail, Phone } from 'lucide-svelte';
  import * as m from '$lib/paraglide/messages';

  let { socials = [] }: { socials?: Array<{ href: string; label: string; icon: any }> } = $props();

  const contacts = [
    { href: 'mailto:fanroc@fschool.edu.vn', icon: Mail, text: 'fanroc@fschool.edu.vn' },
    { href: 'tel:0123456789', icon: Phone, text: '0123 456 789' },
  ];
</script>

<div>
  <h3 class="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{m.contact_label()}</h3>
  <div class="space-y-4">
    {#each contacts as item}
      {@const Icon = item.icon}
      <a href={item.href} class="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 transition hover:text-cyan-600 dark:hover:text-cyan-300">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <Icon class="h-4 w-4" />
        </div>
        {item.text}
      </a>
    {/each}
  </div>

  <h3 class="mt-8 mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{m.follow_us_label()}</h3>
  <div class="flex gap-3">
    {#each socials as s}
      {@const Icon = s.icon}
      <a href={s.href} aria-label={s.label}
        class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-300">
        <Icon class="h-4 w-4" />
      </a>
    {/each}
  </div>
</div>
