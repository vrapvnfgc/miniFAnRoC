<script lang="ts">
	import { CheckCircle, Circle, Clock, Zap, Rocket, Star, Trophy } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import { timelineEvents } from '$lib/data';

	const iconMap: Record<string, typeof Zap> = {
		zap: Zap,
		clock: Clock,
		rocket: Rocket,
		trophy: Trophy,
		star: Star
	};
</script>

<section
	id="schedule"
	class="relative px-4 py-20 sm:px-6 lg:px-8"
	aria-label={$t('timeline.title')}
>
	<!-- BG -->
	<div class="pointer-events-none absolute inset-0">
		<div
			class="absolute top-0 h-px w-full"
			style="background: linear-gradient(90deg, transparent, rgba(139,71,255,0.3), transparent);"
		></div>
	</div>

	<div class="mx-auto max-w-4xl">
		<div class="mb-16 text-center">
			<span
				class="mb-3 block font-mono text-xs tracking-widest uppercase"
				style="color: var(--accent-violet, #8b47ff);"
			>
				// Schedule
			</span>
			<h2 class="section-title mb-4 text-3xl sm:text-4xl lg:text-5xl">
				{$t('timeline.title')}
			</h2>
			<p class="mx-auto max-w-xl text-sm sm:text-base" style="color: var(--text-secondary);">
				{$t('timeline.subtitle')}
			</p>
		</div>

		<!-- Timeline -->
		<div class="relative">
			<!-- Center line -->
			<div
				class="absolute top-0 bottom-0 left-6 w-px sm:left-1/2"
				style="background: linear-gradient(to bottom, transparent, rgba(0,180,230,0.4), rgba(139,71,255,0.4), transparent);"
			></div>

			<div class="flex flex-col gap-8">
				{#each timelineEvents as event, i}
					{@const isLeft = i % 2 === 0}
					{@const isDone = event.status === 'done'}
					{@const isCurrent = event.status === 'current'}
					{@const Icon = iconMap[event.icon] ?? Zap}

					<div
						class="relative flex items-center"
						class:flex-row-reverse={!isLeft}
						style="--delay: {i * 0.1}s;"
					>
						<!-- Content card -->
						<div
							class="w-full sm:w-5/12 {isLeft
								? 'sm:pr-12 sm:text-right'
								: 'sm:pl-12 sm:text-left'} pl-16 sm:pl-0"
						>
							<div
								class="glass-card p-5 transition-all duration-300 hover:-translate-y-1"
								class:opacity-70={event.status === 'upcoming'}
								style={isCurrent
									? 'border-color: rgba(0,180,230,0.5); box-shadow: 0 0 20px rgba(0,180,230,0.15);'
									: ''}
							>
								{#if isCurrent}
									<div
										class="mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs"
										style="background: rgba(0,180,230,0.15); border: 1px solid rgba(0,180,230,0.4); color: var(--accent-cyan);"
									>
										<div class="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400"></div>
										LIVE
									</div>
								{/if}
								<p class="mb-1.5 font-mono text-xs" style="color: var(--accent-cyan);">
									{event.date}
								</p>
								<h3
									class="font-display mb-1.5 text-base font-bold"
									style="color: var(--text-primary);"
								>
									{$t(event.titleKey)}
								</h3>
								<p class="text-sm leading-relaxed" style="color: var(--text-secondary);">
									{$t(event.descriptionKey)}
								</p>
							</div>
						</div>

						<!-- Center node -->
						<div
							class="absolute left-0 z-10 flex items-center justify-center sm:left-1/2 sm:-translate-x-1/2"
						>
							<div
								class="flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300"
								style={isDone
									? 'background: rgba(0,230,120,0.2); border: 2px solid rgba(0,230,120,0.6);'
									: isCurrent
										? 'background: rgba(0,180,230,0.2); border: 2px solid rgba(0,180,230,0.8); box-shadow: 0 0 20px rgba(0,180,230,0.4);'
										: 'background: rgba(0,0,0,0.4); border: 2px solid rgba(100,116,139,0.4);'}
							>
								{#if isDone}
									<CheckCircle size={20} style="color: #00e678;" />
								{:else if isCurrent}
									<Icon size={20} style="color: var(--accent-cyan);" class="animate-pulse" />
								{:else}
									<Circle size={20} style="color: rgba(100,116,139,0.5);" />
								{/if}
							</div>
						</div>

						<!-- Spacer (desktop) -->
						<div class="hidden w-5/12 sm:block"></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
