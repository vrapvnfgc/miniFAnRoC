<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { teamStore, type TeamFormData } from '$lib/stores/teams';
	import { UserPlus, Mail, Users, User, Hash, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-svelte';

	const competitionId = $derived(page.params.competition_id);

	// Form state
	let captainEmail = $state('');
	let teamName = $state('');
	let captainName = $state('');
	let memberCount = $state<number>(3);

	// UI state
	let submitting = $state(false);
	let success = $state(false);
	let error = $state('');

	// Validation
	const emailValid = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(captainEmail));
	const nameValid = $derived(teamName.trim().length >= 2);
	const captainValid = $derived(captainName.trim().length >= 2);
	const countValid = $derived(memberCount >= 2 && memberCount <= 10);
	const formValid = $derived(emailValid && nameValid && captainValid && countValid);

	// Touch tracking for per-field validation messages
	let touched = $state({ email: false, name: false, captain: false, count: false });

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!formValid) return;

		submitting = true;
		error = '';

		try {
			// Simulate async (would be API call in production)
			await new Promise((r) => setTimeout(r, 900));

			const data: TeamFormData = {
				captainEmail: captainEmail.trim(),
				teamName: teamName.trim(),
				captainName: captainName.trim(),
				memberCount
			};

			teamStore.addTeam(data);
			success = true;
		} catch (err) {
			error = 'Có lỗi xảy ra. Vui lòng thử lại.';
		} finally {
			submitting = false;
		}
	}

	function goToTeams() {
		goto(`/competitions/${competitionId}/teams`);
	}

	function resetForm() {
		captainEmail = '';
		teamName = '';
		captainName = '';
		memberCount = 3;
		touched = { email: false, name: false, captain: false, count: false };
		success = false;
		error = '';
	}
</script>

<svelte:head>
	<title>Đăng Ký Đội — miniFAnRoC</title>
</svelte:head>

<div class="mx-auto max-w-2xl">

	<!-- Back link -->
	<button
		onclick={goToTeams}
		class="mb-6 flex items-center gap-2 text-sm text-slate-500 transition hover:text-cyan-400"
	>
		<ArrowLeft class="h-4 w-4" />
		Quay lại danh sách đội
	</button>

	<!-- Card -->
	<div class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
		<!-- Top gradient strip -->
		<div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500"></div>
		<!-- Background glow -->
		<div class="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
		<div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none"></div>

		<div class="relative p-6 sm:p-10">
			<!-- Header -->
			<div class="mb-8 flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
					<UserPlus class="h-6 w-6 text-white" />
				</div>
				<div>
					<h2 class="text-2xl font-bold text-white">Đăng Ký Đội Thi</h2>
					<p class="text-sm text-slate-400">FSchool AI & Robotics Challenge 2025</p>
				</div>
			</div>

			{#if success}
				<!-- Success state -->
				<div class="flex flex-col items-center gap-6 py-10 text-center">
					<div class="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/30">
						<CheckCircle class="h-10 w-10 text-emerald-400" />
					</div>
					<div>
						<h3 class="text-xl font-bold text-white">Đăng Ký Thành Công! 🎉</h3>
						<p class="mt-2 text-slate-400">
							Đội <span class="font-semibold text-cyan-400">{teamName}</span> đã được thêm vào danh sách.
						</p>
						<p class="mt-1 text-sm text-slate-500">
							Email xác nhận sẽ được gửi đến <span class="text-cyan-400">{captainEmail}</span>
						</p>
					</div>
					<div class="flex gap-3">
						<button
							onclick={goToTeams}
							class="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105"
						>
							Xem Danh Sách Đội
						</button>
						<button
							onclick={resetForm}
							class="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10"
						>
							Đăng Ký Đội Khác
						</button>
					</div>
				</div>
			{:else}
				<!-- Form -->
				<form onsubmit={handleSubmit} class="flex flex-col gap-6" novalidate>

					<!-- Email field -->
					<div class="flex flex-col gap-2">
						<label for="captain-email" class="flex items-center gap-2 text-sm font-semibold text-slate-300">
							<Mail class="h-4 w-4 text-cyan-400" />
							Email Đội Trưởng <span class="text-rose-400">*</span>
						</label>
						<input
							id="captain-email"
							type="email"
							bind:value={captainEmail}
							onblur={() => touched.email = true}
							placeholder="vd: captain@fschool.edu.vn"
							autocomplete="email"
							class="w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition
								{touched.email && !emailValid
									? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
									: 'border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30'}"
						/>
						{#if touched.email && !emailValid}
							<p class="flex items-center gap-1.5 text-xs text-rose-400">
								<AlertCircle class="h-3.5 w-3.5" />
								Vui lòng nhập email hợp lệ
							</p>
						{/if}
					</div>

					<!-- Team name field -->
					<div class="flex flex-col gap-2">
						<label for="team-name" class="flex items-center gap-2 text-sm font-semibold text-slate-300">
							<Hash class="h-4 w-4 text-violet-400" />
							Tên Đội <span class="text-rose-400">*</span>
						</label>
						<input
							id="team-name"
							type="text"
							bind:value={teamName}
							onblur={() => touched.name = true}
							placeholder="vd: Quantum Nexus"
							autocomplete="off"
							class="w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition
								{touched.name && !nameValid
									? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
									: 'border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30'}"
						/>
						{#if touched.name && !nameValid}
							<p class="flex items-center gap-1.5 text-xs text-rose-400">
								<AlertCircle class="h-3.5 w-3.5" />
								Tên đội phải có ít nhất 2 ký tự
							</p>
						{/if}
					</div>

					<!-- Captain name -->
					<div class="flex flex-col gap-2">
						<label for="captain-name" class="flex items-center gap-2 text-sm font-semibold text-slate-300">
							<User class="h-4 w-4 text-blue-400" />
							Tên Đội Trưởng <span class="text-rose-400">*</span>
						</label>
						<input
							id="captain-name"
							type="text"
							bind:value={captainName}
							onblur={() => touched.captain = true}
							placeholder="vd: Nguyễn Văn A"
							autocomplete="name"
							class="w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition
								{touched.captain && !captainValid
									? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
									: 'border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30'}"
						/>
						{#if touched.captain && !captainValid}
							<p class="flex items-center gap-1.5 text-xs text-rose-400">
								<AlertCircle class="h-3.5 w-3.5" />
								Vui lòng nhập tên đội trưởng
							</p>
						{/if}
					</div>

					<!-- Member count -->
					<div class="flex flex-col gap-2">
						<label for="member-count" class="flex items-center gap-2 text-sm font-semibold text-slate-300">
							<Users class="h-4 w-4 text-emerald-400" />
							Số Lượng Thành Viên <span class="text-rose-400">*</span>
						</label>
						<div class="flex items-center gap-4">
							<input
								id="member-count"
								type="range"
								min="2"
								max="10"
								bind:value={memberCount}
								onblur={() => touched.count = true}
								class="flex-1 accent-cyan-500"
							/>
							<span class="flex h-10 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-bold text-cyan-400">
								{memberCount}
							</span>
						</div>
						<div class="flex justify-between text-[10px] text-slate-600">
							<span>2 (tối thiểu)</span>
							<span>10 (tối đa)</span>
						</div>
						{#if touched.count && !countValid}
							<p class="flex items-center gap-1.5 text-xs text-rose-400">
								<AlertCircle class="h-3.5 w-3.5" />
								Số thành viên phải từ 2 đến 10
							</p>
						{/if}
					</div>

					<!-- Summary card -->
					{#if formValid}
						<div class="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
							<p class="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-400">Xác Nhận Thông Tin</p>
							<div class="grid gap-1.5 text-sm">
								<div class="flex justify-between">
									<span class="text-slate-500">Tên đội</span>
									<span class="font-semibold text-white">{teamName}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-slate-500">Đội trưởng</span>
									<span class="text-white">{captainName}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-slate-500">Email</span>
									<span class="text-white">{captainEmail}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-slate-500">Số thành viên</span>
									<span class="text-white">{memberCount} người</span>
								</div>
							</div>
						</div>
					{/if}

					<!-- Error message -->
					{#if error}
						<div class="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
							<AlertCircle class="h-4 w-4 shrink-0" />
							{error}
						</div>
					{/if}

					<!-- Submit button -->
					<button
						type="submit"
						disabled={!formValid || submitting}
						class="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-sm font-bold transition-all
							{formValid && !submitting
								? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] hover:shadow-cyan-500/40 active:scale-[0.98]'
								: 'cursor-not-allowed bg-white/10 text-slate-500'}"
					>
						{#if submitting}
							<span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
							Đang đăng ký...
						{:else}
							<UserPlus class="h-4 w-4" />
							Xác Nhận Đăng Ký
						{/if}
					</button>

					<p class="text-center text-xs text-slate-600">
						Sau khi đăng ký, thông tin đội sẽ xuất hiện ngay trong <span class="text-cyan-400">Danh Sách Đội</span>.
					</p>
				</form>
			{/if}
		</div>
	</div>
</div>
