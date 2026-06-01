<script lang="ts">
	import { Construction, ArrowLeft } from 'lucide-svelte';

	type Props = {
		title: string;
		description: string;
	};

	let { title, description }: Props = $props();
</script>

<main class="px-4 pt-32 pb-24 sm:px-6">
	<section class="mx-auto max-w-3xl text-center">
		<div
			class="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300"
		>
			<Construction class="h-7 w-7" />
		</div>
		<p
			class="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400"
		>
			Coming soon
		</p>
		<h1 class="text-4xl leading-tight font-black text-slate-900 sm:text-5xl dark:text-white">
			{title}
		</h1>
		<p class="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
			{description}
		</p>
		<a
			href="/homepage"
			class="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
		>
			<ArrowLeft class="h-4 w-4" />
			Back to homepage
		</a>
	</section>
</main>
