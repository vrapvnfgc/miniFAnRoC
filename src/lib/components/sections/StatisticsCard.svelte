<script lang="ts">
	import { t } from '$lib/i18n';
	import type { Stat } from '$lib/data';

	export let stat: Stat;
</script>

<div class="glass-card-hover p-5 text-center group">
	<div
		class="font-display font-black text-3xl sm:text-4xl mb-1 transition-all duration-300 group-hover:scale-110"
		class:text-cyber-400={stat.color === 'text-cyber-400'}
		class:text-violet-400={stat.color === 'text-violet-400'}
		class:text-cyan-400={stat.color === 'text-cyan-400'}
		class:text-amber-400={stat.color === 'text-amber-400'}
	>
		{stat.value}{stat.suffix ?? ''}
	</div>
	<div class="text-xs font-mono uppercase tracking-widest" style="color: var(--text-secondary);">
		{$t(stat.key)}
	</div>
</div>
