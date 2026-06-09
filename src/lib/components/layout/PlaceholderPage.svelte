<script lang="ts">
	import { ArrowRight, Clock, FileText } from 'lucide-svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import Navbar from './Navbar.svelte';
	import Footer from './Footer.svelte';

	type LocalizedText = {
		en: string;
		vi: string;
	};

	type Action = {
		href: string;
		label: LocalizedText;
	};

	type Props = {
		title: LocalizedText;
		description: LocalizedText;
		kicker?: LocalizedText;
		items?: LocalizedText[];
		primaryAction?: Action;
	};

	let {
		title,
		description,
		kicker = {
			en: 'Coming soon',
			vi: 'Sắp ra mắt'
		},
		items = [],
		primaryAction = {
			href: '/',
			label: {
				en: 'Back to home',
				vi: 'Về trang chủ'
			}
		}
	}: Props = $props();

	const locale = $derived(getLocale() as 'en' | 'vi');
	const t = $derived.by(() => ({
		title: title[locale],
		description: description[locale],
		kicker: kicker[locale],
		items: items.map((item) => item[locale]),
		action: primaryAction.label[locale]
	}));
</script>

<svelte:head>
	<title>{t.title} · miniFAnRoC</title>
	<meta name="description" content={t.description} />
</svelte:head>

<Navbar />

<section class="min-h-screen bg-slate-50 px-6 py-28 text-slate-950 dark:bg-slate-950 dark:text-white">
	<div class="mx-auto max-w-5xl">
		<div
			class="rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-slate-900/80 sm:p-10"
		>
			<div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
				<div class="max-w-2xl">
					<div
						class="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300"
					>
						<Clock class="h-3.5 w-3.5" />
						{t.kicker}
					</div>
					<h1 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
						{t.title}
					</h1>
					<p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
						{t.description}
					</p>
					<a
						href={primaryAction.href}
						class="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
					>
						{t.action}
						<ArrowRight class="h-4 w-4" />
					</a>
				</div>

				<div
					class="flex min-h-44 w-full max-w-sm flex-col justify-center rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-slate-950/60"
				>
					<FileText class="mb-4 h-8 w-8 text-cyan-600 dark:text-cyan-400" />
					{#if t.items.length}
						<ul class="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
							{#each t.items as item}
								<li class="flex gap-2">
									<span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500"></span>
									<span>{item}</span>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
							{locale === 'vi'
								? 'Nội dung chi tiết sẽ được ban tổ chức cập nhật trong thời gian tới.'
								: 'Detailed content will be updated by the organizers soon.'}
						</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<Footer />
