<script lang="ts">
	import { t } from '$lib/i18n';
	import type { Stat } from '$lib/data';

	let { stat }: { stat: Stat } = $props();
</script>

<div class="glass-card-hover group p-5 text-center">
	<div
		class="font-display mb-1 text-3xl font-black transition-all duration-300 group-hover:scale-110 sm:text-4xl"
		class:text-cyber-400={stat.color === 'text-cyber-400'}
		class:text-violet-400={stat.color === 'text-violet-400'}
		class:text-cyan-400={stat.color === 'text-cyan-400'}
		class:text-amber-400={stat.color === 'text-amber-400'}
	>
		{stat.value}{stat.suffix ?? ''}
	</div>
	<div class="font-mono text-xs tracking-widest uppercase" style="color: var(--text-secondary);">
		{$t(stat.key)}
	</div>
</div>
