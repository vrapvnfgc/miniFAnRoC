<script lang="ts">
	import { ArrowLeft, CheckCircle, Loader2, User, Mail, Users, Shield } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import { teamStore, type TeamFormData } from '$lib/stores/teams';
	import { uiStore } from '$lib/stores/ui';
	import { fade, fly, scale } from 'svelte/transition';

	const { addTeam } = teamStore;
	const { switchTab, registrationSuccess } = uiStore;

	let form: TeamFormData = {
		captainEmail: '',
		teamName: '',
		captainName: '',
		memberCount: 3
	};

	type Errors = Partial<Record<keyof TeamFormData, string>>;
	let errors: Errors = {};
	let submitting = false;

	function validate(): boolean {
		errors = {};
		const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!form.captainEmail) errors.captainEmail = $t('register.validation.email_required');
		else if (!emailRe.test(form.captainEmail)) errors.captainEmail = $t('register.validation.email_invalid');

		if (!form.teamName) errors.teamName = $t('register.validation.team_name_required');
		else if (form.teamName.length < 3) errors.teamName = $t('register.validation.team_name_min');

		if (!form.captainName) errors.captainName = $t('register.validation.captain_name_required');

		if (!form.memberCount) errors.memberCount = $t('register.validation.member_count_required');
		else if (form.memberCount < 2 || form.memberCount > 6) errors.memberCount = $t('register.validation.member_count_range');

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		if (!validate()) return;
		submitting = true;
		// Simulate async
		await new Promise((r) => setTimeout(r, 900));
		addTeam(form);
		submitting = false;
		registrationSuccess.set(true);
		form = { captainEmail: '', teamName: '', captainName: '', memberCount: 3 };
	}
</script>

{#if $registrationSuccess}
	<!-- Success state -->
	<div
		class="flex flex-col items-center justify-center py-20 text-center"
		in:scale={{ duration: 400, start: 0.8 }}
	>
		<div
			class="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-glow-pulse"
			style="background: rgba(0, 230, 120, 0.15); border: 2px solid rgba(0, 230, 120, 0.5);"
		>
			<CheckCircle size={40} style="color: #00e678;" />
		</div>
		<h3 class="font-display font-bold text-2xl mb-3 text-gradient">
			{$t('register.success_title')}
		</h3>
		<p class="mb-8 max-w-sm" style="color: var(--text-secondary);">
			{$t('register.success_message')}
		</p>
		<button
			on:click={() => switchTab('list')}
			class="btn-ghost"
		>
			{$t('register.back_to_list')}
		</button>
	</div>
{:else}
	<!-- Form -->
	<div in:fade={{ duration: 300 }}>
		<!-- Back button -->
		<button
			on:click={() => switchTab('list')}
			class="btn-ghost mb-6 !px-3 !py-2"
		>
			<ArrowLeft size={15} />
			{$t('register.back_to_list')}
		</button>

		<div class="max-w-xl mx-auto">
			<div class="glass-card p-6 sm:p-8">
				<!-- Header -->
				<div class="mb-8">
					<h2 class="font-display font-bold text-2xl sm:text-3xl mb-2 text-gradient">
						{$t('register.title')}
					</h2>
					<p class="text-sm" style="color: var(--text-secondary);">
						{$t('register.subtitle')}
					</p>
				</div>

				<!-- Form fields -->
				<form
					on:submit|preventDefault={handleSubmit}
					class="flex flex-col gap-5"
					novalidate
					aria-label={$t('register.title')}
				>
					<!-- Email -->
					<div class="flex flex-col gap-1.5">
						<label
							for="captainEmail"
							class="flex items-center gap-2 text-xs font-mono uppercase tracking-widest"
							style="color: var(--accent-cyan);"
						>
							<Mail size={12} />
							{$t('register.fields.captain_email')}
						</label>
						<input
							id="captainEmail"
							type="email"
							class="input-field"
							class:border-red-500={errors.captainEmail}
							placeholder={$t('register.fields.captain_email_placeholder')}
							bind:value={form.captainEmail}
							autocomplete="email"
							aria-describedby={errors.captainEmail ? 'email-error' : undefined}
							aria-invalid={!!errors.captainEmail}
						/>
						{#if errors.captainEmail}
							<span id="email-error" class="text-xs text-red-400" role="alert" in:fly={{ y: -4, duration: 150 }}>
								{errors.captainEmail}
							</span>
						{/if}
					</div>

					<!-- Team name -->
					<div class="flex flex-col gap-1.5">
						<label
							for="teamName"
							class="flex items-center gap-2 text-xs font-mono uppercase tracking-widest"
							style="color: var(--accent-cyan);"
						>
							<Shield size={12} />
							{$t('register.fields.team_name')}
						</label>
						<input
							id="teamName"
							type="text"
							class="input-field"
							class:border-red-500={errors.teamName}
							placeholder={$t('register.fields.team_name_placeholder')}
							bind:value={form.teamName}
							aria-describedby={errors.teamName ? 'teamname-error' : undefined}
							aria-invalid={!!errors.teamName}
						/>
						{#if errors.teamName}
							<span id="teamname-error" class="text-xs text-red-400" role="alert" in:fly={{ y: -4, duration: 150 }}>
								{errors.teamName}
							</span>
						{/if}
					</div>

					<!-- Captain name -->
					<div class="flex flex-col gap-1.5">
						<label
							for="captainName"
							class="flex items-center gap-2 text-xs font-mono uppercase tracking-widest"
							style="color: var(--accent-cyan);"
						>
							<User size={12} />
							{$t('register.fields.captain_name')}
						</label>
						<input
							id="captainName"
							type="text"
							class="input-field"
							class:border-red-500={errors.captainName}
							placeholder={$t('register.fields.captain_name_placeholder')}
							bind:value={form.captainName}
							autocomplete="name"
							aria-describedby={errors.captainName ? 'captain-error' : undefined}
							aria-invalid={!!errors.captainName}
						/>
						{#if errors.captainName}
							<span id="captain-error" class="text-xs text-red-400" role="alert" in:fly={{ y: -4, duration: 150 }}>
								{errors.captainName}
							</span>
						{/if}
					</div>

					<!-- Member count -->
					<div class="flex flex-col gap-1.5">
						<label
							for="memberCount"
							class="flex items-center gap-2 text-xs font-mono uppercase tracking-widest"
							style="color: var(--accent-cyan);"
						>
							<Users size={12} />
							{$t('register.fields.member_count')}
						</label>
						<div class="flex items-center gap-3">
							<input
								id="memberCount"
								type="range"
								min="2"
								max="6"
								step="1"
								class="flex-1 accent-cyan-400 cursor-pointer"
								bind:value={form.memberCount}
								aria-describedby={errors.memberCount ? 'members-error' : undefined}
								aria-invalid={!!errors.memberCount}
							/>
							<div
								class="w-12 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-lg shrink-0"
								style="background: rgba(0, 180, 230, 0.1); border: 1px solid rgba(0, 180, 230, 0.3); color: var(--accent-cyan);"
							>
								{form.memberCount}
							</div>
						</div>
						{#if errors.memberCount}
							<span id="members-error" class="text-xs text-red-400" role="alert" in:fly={{ y: -4, duration: 150 }}>
								{errors.memberCount}
							</span>
						{/if}
					</div>

					<!-- Divider -->
					<div class="h-px" style="background: var(--border-color);" />

					<!-- Submit -->
					<button
						type="submit"
						class="btn-primary justify-center py-4 text-base"
						disabled={submitting}
						aria-disabled={submitting}
					>
						{#if submitting}
							<Loader2 size={18} class="animate-spin" />
							{$t('register.submitting')}
						{:else}
							{$t('register.submit')}
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
