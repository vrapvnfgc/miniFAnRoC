<script lang="ts">
	import { ArrowLeft, CheckCircle, Loader2, User, Mail, Users, Shield } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';
	import { teamStore, type TeamFormData } from '$lib/stores/teams';
	import { uiStore } from '$lib/stores/ui';
	import { fade, fly, scale } from 'svelte/transition';

	const { addTeam } = teamStore;
	const { switchTab, registrationSuccess } = uiStore;

	let form: TeamFormData = $state({
		captainEmail: '',
		teamName: '',
		captainName: '',
		memberCount: 3
	});

	type Errors = Partial<Record<keyof TeamFormData, string>>;
	let errors: Errors = $state({});
	let submitting = $state(false);

	function validate(): boolean {
		errors = {};
		const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!form.captainEmail) errors.captainEmail = (m as any).register_validation_email_required?.() || 'Email is required';
		else if (!emailRe.test(form.captainEmail))
			errors.captainEmail = (m as any).register_validation_email_invalid?.() || 'Email is invalid';

		if (!form.teamName) errors.teamName = (m as any).register_validation_team_name_required?.() || 'Team name is required';
		else if (form.teamName.length < 3) errors.teamName = (m as any).register_validation_team_name_min?.() || 'Team name is too short';

		if (!form.captainName) errors.captainName = (m as any).register_validation_captain_name_required?.() || 'Captain name is required';

		if (!form.memberCount) errors.memberCount = (m as any).register_validation_member_count_required?.() || 'Member count is required';
		else if (form.memberCount < 2 || form.memberCount > 6)
			errors.memberCount = (m as any).register_validation_member_count_range?.() || 'Member count must be between 2 and 6';

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
			class="animate-glow-pulse mb-6 flex h-20 w-20 items-center justify-center rounded-full"
			style="background: rgba(0, 230, 120, 0.15); border: 2px solid rgba(0, 230, 120, 0.5);"
		>
			<CheckCircle size={40} style="color: #00e678;" />
		</div>
		<h3 class="font-display text-gradient mb-3 text-2xl font-bold">
			{(m as any).register_success_title?.() || 'Registration Successful'}
		</h3>
		<p class="mb-8 max-w-sm" style="color: var(--text-secondary);">
			{(m as any).register_success_message?.() || 'Your team has been registered successfully.'}
		</p>
		<button onclick={() => switchTab('list')} class="btn-ghost">
			{(m as any).register_back_to_list?.() || 'Back to Team List'}
		</button>
	</div>
{:else}
	<!-- Form -->
	<div in:fade={{ duration: 300 }}>
		<!-- Back button -->
		<button onclick={() => switchTab('list')} class="btn-ghost mb-6 !px-3 !py-2">
			<ArrowLeft size={15} />
			{(m as any).register_back_to_list?.() || 'Back to Team List'}
		</button>

		<div class="mx-auto max-w-xl">
			<div class="glass-card p-6 sm:p-8">
				<!-- Header -->
				<div class="mb-8">
					<h2 class="font-display text-gradient mb-2 text-2xl font-bold sm:text-3xl">
						{(m as any).register_title?.() || 'Register Team'}
					</h2>
					<p class="text-sm" style="color: var(--text-secondary);">
						{(m as any).register_subtitle?.() || 'Fill in the details below to register your team.'}
					</p>
				</div>

				<!-- Form fields -->
				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
					class="flex flex-col gap-5"
					novalidate
					aria-label={(m as any).register_title?.() || 'Register Team'}
				>
					<!-- Email -->
					<div class="flex flex-col gap-1.5">
						<label
							for="captainEmail"
							class="flex items-center gap-2 font-mono text-xs tracking-widest uppercase"
							style="color: var(--accent-cyan);"
						>
							<Mail size={12} />
							{(m as any).register_fields_captain_email?.() || 'Captain Email'}
						</label>
						<input
							id="captainEmail"
							type="email"
							class="input-field"
							class:border-red-500={errors.captainEmail}
							placeholder={(m as any).register_fields_captain_email_placeholder?.() || 'Enter captain email'}
							bind:value={form.captainEmail}
							autocomplete="email"
							aria-describedby={errors.captainEmail ? 'email-error' : undefined}
							aria-invalid={!!errors.captainEmail}
						/>
						{#if errors.captainEmail}
							<span
								id="email-error"
								class="text-xs text-red-400"
								role="alert"
								in:fly={{ y: -4, duration: 150 }}
							>
								{errors.captainEmail}
							</span>
						{/if}
					</div>

					<!-- Team name -->
					<div class="flex flex-col gap-1.5">
						<label
							for="teamName"
							class="flex items-center gap-2 font-mono text-xs tracking-widest uppercase"
							style="color: var(--accent-cyan);"
						>
							<Shield size={12} />
							{(m as any).register_fields_team_name?.() || 'Team Name'}
						</label>
						<input
							id="teamName"
							type="text"
							class="input-field"
							class:border-red-500={errors.teamName}
							placeholder={(m as any).register_fields_team_name_placeholder?.() || 'Enter team name'}
							bind:value={form.teamName}
							aria-describedby={errors.teamName ? 'teamname-error' : undefined}
							aria-invalid={!!errors.teamName}
						/>
						{#if errors.teamName}
							<span
								id="teamname-error"
								class="text-xs text-red-400"
								role="alert"
								in:fly={{ y: -4, duration: 150 }}
							>
								{errors.teamName}
							</span>
						{/if}
					</div>

					<!-- Captain name -->
					<div class="flex flex-col gap-1.5">
						<label
							for="captainName"
							class="flex items-center gap-2 font-mono text-xs tracking-widest uppercase"
							style="color: var(--accent-cyan);"
						>
							<User size={12} />
							{(m as any).register_fields_captain_name?.() || 'Captain Name'}
						</label>
						<input
							id="captainName"
							type="text"
							class="input-field"
							class:border-red-500={errors.captainName}
							placeholder={(m as any).register_fields_captain_name_placeholder?.() || 'Enter captain name'}
							bind:value={form.captainName}
							autocomplete="name"
							aria-describedby={errors.captainName ? 'captain-error' : undefined}
							aria-invalid={!!errors.captainName}
						/>
						{#if errors.captainName}
							<span
								id="captain-error"
								class="text-xs text-red-400"
								role="alert"
								in:fly={{ y: -4, duration: 150 }}
							>
								{errors.captainName}
							</span>
						{/if}
					</div>

					<!-- Member count -->
					<div class="flex flex-col gap-1.5">
						<label
							for="memberCount"
							class="flex items-center gap-2 font-mono text-xs tracking-widest uppercase"
							style="color: var(--accent-cyan);"
						>
							<Users size={12} />
							{(m as any).register_fields_member_count?.() || 'Member Count'}
						</label>
						<div class="flex items-center gap-3">
							<input
								id="memberCount"
								type="range"
								min="2"
								max="6"
								step="1"
								class="flex-1 cursor-pointer accent-cyan-400"
								bind:value={form.memberCount}
								aria-describedby={errors.memberCount ? 'members-error' : undefined}
								aria-invalid={!!errors.memberCount}
							/>
							<div
								class="flex h-10 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-lg font-bold"
								style="background: rgba(0, 180, 230, 0.1); border: 1px solid rgba(0, 180, 230, 0.3); color: var(--accent-cyan);"
							>
								{form.memberCount}
							</div>
						</div>
						{#if errors.memberCount}
							<span
								id="members-error"
								class="text-xs text-red-400"
								role="alert"
								in:fly={{ y: -4, duration: 150 }}
							>
								{errors.memberCount}
							</span>
						{/if}
					</div>

					<!-- Divider -->
					<div class="h-px" style="background: var(--border-color);"></div>

					<!-- Submit -->
					<button
						type="submit"
						class="btn-primary justify-center py-4 text-base"
						disabled={submitting}
						aria-disabled={submitting}
					>
						{#if submitting}
							<Loader2 size={18} class="animate-spin" />
							{(m as any).register_submitting?.() || 'Submitting...'}
						{:else}
							{(m as any).register_submit?.() || 'Register'}
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
