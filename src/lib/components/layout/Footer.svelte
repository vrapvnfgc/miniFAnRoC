<script lang="ts">
	import { Bot, Github, Globe } from 'lucide-svelte';
	import { t } from '$lib/i18n';

	const year = new Date().getFullYear();
</script>

<footer
	class="relative border-t py-12 px-4 sm:px-6 lg:px-8"
	style="border-color: var(--border-color); background: rgba(8,13,28,0.9);"
>
	<div class="max-w-6xl mx-auto">
		<div class="flex flex-col md:flex-row items-center justify-between gap-6">
			<!-- Brand -->
			<div class="flex flex-col items-center md:items-start gap-2">
				<div class="flex items-center gap-2.5">
					<div
						class="w-8 h-8 rounded-xl flex items-center justify-center"
						style="background: linear-gradient(135deg, #00b4e6, #8b47ff);"
					>
						<Bot size={16} class="text-white" />
					</div>
					<span class="font-display font-bold text-lg tracking-wider text-gradient">
						miniFAnRoC
					</span>
				</div>
				<p class="text-xs text-center md:text-left" style="color: var(--text-secondary);">
					{$t('footer.tagline')}
				</p>
			</div>

			<!-- Center info -->
			<div class="text-center">
				<p class="text-xs font-mono" style="color: var(--text-secondary);">
					{$t('footer.organized_by')}
				</p>
				<p class="text-xs mt-1" style="color: var(--text-secondary); opacity: 0.6;">
					© {year} miniFAnRoC. {$t('footer.rights')}
				</p>
			</div>

			<!-- Links -->
			<div class="flex items-center gap-3">
				<a
					href="https://fpt.edu.vn"
					target="_blank"
					rel="noopener noreferrer"
					class="btn-ghost !px-3 !py-2"
					aria-label="FPT University website"
				>
					<Globe size={15} />
				</a>
				<a
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
					class="btn-ghost !px-3 !py-2"
					aria-label="GitHub"
				>
					<Github size={15} />
				</a>
			</div>
		</div>
	</div>
</footer>
