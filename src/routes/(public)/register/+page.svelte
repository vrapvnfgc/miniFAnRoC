<script lang="ts">
	import { CheckCircle, Loader2, Mail, Shield, User, Users } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';

	type FormState = {
		email: string;
		teamName: string;
		representativeName: string;
		studentCount: number;
		mentorName: string;
		mentorEmail: string;
	};

	let form: FormState = $state({
		email: '',
		teamName: '',
		representativeName: '',
		studentCount: 4,
		mentorName: '',
		mentorEmail: ''
	});
	let errors: Partial<Record<keyof FormState, string>> = $state({});
	let submitting = $state(false);
	let submitted = $state(false);

	function validate() {
		errors = {};
		const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!form.email) errors.email = m.register_email_required();
		else if (!emailRe.test(form.email)) errors.email = m.register_email_invalid();

		if (!form.teamName) errors.teamName = m.register_team_name_required();
		else if (form.teamName.length < 3) errors.teamName = m.register_team_name_min();

		if (!form.representativeName)
			errors.representativeName = m.register_representative_name_required();

		if (form.studentCount < 1 || form.studentCount > 4)
			errors.studentCount = m.register_student_count_range();

		if (!form.mentorName) errors.mentorName = m.register_mentor_name_required();

		if (!form.mentorEmail) errors.mentorEmail = m.register_mentor_email_required();
		else if (!emailRe.test(form.mentorEmail))
			errors.mentorEmail = m.register_mentor_email_invalid();

		return Object.keys(errors).length === 0;
	}

	async function submitRegistration() {
		if (!validate()) return;

		submitting = true;
		await new Promise((resolve) => setTimeout(resolve, 600));
		submitting = false;
		submitted = true;
	}
</script>

<svelte:head>
	<title>{m.register_page_title()}</title>
	<meta name="description" content={m.register_page_description()} />
</svelte:head>

<main class="px-4 pt-32 pb-24 sm:px-6">
	<section class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
		<div>
			<p
				class="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400"
			>
				{m.register_label()}
			</p>
			<h1 class="text-4xl leading-tight font-black text-slate-900 sm:text-5xl dark:text-white">
				{m.register_heading()}
			</h1>
			<p class="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
				{m.register_description()}
			</p>
		</div>

		<div
			class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-white/[0.03]"
		>
			{#if submitted}
				<div class="py-12 text-center">
					<div
						class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400"
					>
						<CheckCircle class="h-8 w-8" />
					</div>
					<h2 class="text-2xl font-bold text-slate-900 dark:text-white">
						{m.register_success_title()}
					</h2>
					<p class="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
						{m.register_success_desc()}
					</p>
				</div>
			{:else}
				<form
					class="grid gap-5"
					novalidate
					onsubmit={(event) => {
						event.preventDefault();
						submitRegistration();
					}}
				>
					<div class="grid gap-2">
						<label
							for="email"
							class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
						>
							<Mail class="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
							{m.register_email_label()}
						</label>
						<input
							id="email"
							type="email"
							bind:value={form.email}
							autocomplete="email"
							class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
							aria-invalid={!!errors.email}
						/>
						{#if errors.email}<p class="text-sm text-red-500">{errors.email}</p>{/if}
					</div>

					<div class="grid gap-2">
						<label
							for="teamName"
							class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
						>
							<Shield class="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
							{m.register_team_name_label()}
						</label>
						<input
							id="teamName"
							type="text"
							bind:value={form.teamName}
							class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
							aria-invalid={!!errors.teamName}
						/>
						{#if errors.teamName}<p class="text-sm text-red-500">{errors.teamName}</p>{/if}
					</div>

					<div class="grid gap-2">
						<label
							for="representativeName"
							class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
						>
							<User class="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
							{m.register_representative_name_label()}
						</label>
						<input
							id="representativeName"
							type="text"
							bind:value={form.representativeName}
							autocomplete="name"
							class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
							aria-invalid={!!errors.representativeName}
						/>
						{#if errors.representativeName}
							<p class="text-sm text-red-500">{errors.representativeName}</p>
						{/if}
					</div>

					<div class="grid gap-2">
						<label
							for="studentCount"
							class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
						>
							<Users class="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
							{m.register_student_count_label()}
						</label>
						<div class="flex items-center gap-4">
							<input
								id="studentCount"
								type="range"
								min="1"
								max="4"
								step="1"
								bind:value={form.studentCount}
								class="w-full accent-cyan-500"
								aria-invalid={!!errors.studentCount}
							/>
							<span
								class="flex h-11 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-lg font-bold text-cyan-700 dark:text-cyan-300"
							>
								{form.studentCount}
							</span>
						</div>
						{#if errors.studentCount}<p class="text-sm text-red-500">{errors.studentCount}</p>{/if}
					</div>

					<div class="grid gap-2">
						<label
							for="mentorName"
							class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
						>
							<User class="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
							{m.register_mentor_name_label()}
						</label>
						<input
							id="mentorName"
							type="text"
							bind:value={form.mentorName}
							autocomplete="name"
							class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
							aria-invalid={!!errors.mentorName}
						/>
						{#if errors.mentorName}<p class="text-sm text-red-500">{errors.mentorName}</p>{/if}
					</div>

					<div class="grid gap-2">
						<label
							for="mentorEmail"
							class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
						>
							<Mail class="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
							{m.register_mentor_email_label()}
						</label>
						<input
							id="mentorEmail"
							type="email"
							bind:value={form.mentorEmail}
							autocomplete="email"
							class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
							aria-invalid={!!errors.mentorEmail}
						/>
						{#if errors.mentorEmail}<p class="text-sm text-red-500">{errors.mentorEmail}</p>{/if}
					</div>

					<button
						type="submit"
						disabled={submitting}
						class="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
					>
						{#if submitting}
							<Loader2 class="h-4 w-4 animate-spin" />
							{m.register_submitting()}
						{:else}
							{m.register_submit()}
						{/if}
					</button>
				</form>
			{/if}
		</div>
	</section>
</main>
