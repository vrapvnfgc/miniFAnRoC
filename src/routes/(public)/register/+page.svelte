<script lang="ts">
	import { Send, UsersRound } from 'lucide-svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { languageStore } from '$lib/stores/language.svelte';
	import { api } from '$lib/api/client';

	const copy = {
		vi: {
			title: 'Đăng ký đội thi',
			subtitle:
				'Điền thông tin đội để đăng ký tham gia FSchool AI and Robotics Challenge. Ban tổ chức sẽ xác nhận thông tin sau khi nhận được đăng ký.',
			teamNumber: 'Mã đội',
			teamName: 'Tên đội',
			school: 'Trường',
			coach: 'Huấn luyện viên',
			robotName: 'Tên robot',
			members: 'Thành viên',
			membersHint: 'Mỗi dòng một thành viên',
			submit: 'Gửi đăng ký',
			submitting: 'Đang gửi...',
			success: 'Đã gửi đăng ký đội thành công.',
			offline:
				'Chưa kết nối được backend. Giao diện đăng ký đã sẵn sàng, vui lòng chạy API rồi gửi lại.',
			required: 'Vui lòng nhập mã đội, tên đội và trường.'
		},
		en: {
			title: 'Register a team',
			subtitle:
				'Submit your team information for the FSchool AI and Robotics Challenge. The organizing team will verify the registration after submission.',
			teamNumber: 'Team code',
			teamName: 'Team name',
			school: 'School',
			coach: 'Coach',
			robotName: 'Robot name',
			members: 'Members',
			membersHint: 'One member per line',
			submit: 'Submit registration',
			submitting: 'Submitting...',
			success: 'Team registration submitted successfully.',
			offline: 'Backend is not reachable yet. The registration UI is ready; start the API and submit again.',
			required: 'Please enter team code, team name, and school.'
		}
	} as const;

	let teamNumber = $state('');
	let name = $state('');
	let school = $state('');
	let coach = $state('');
	let robotName = $state('');
	let members = $state('');
	let submitting = $state(false);
	let message = $state('');
	let error = $state('');
	let t = $derived(copy[languageStore.locale]);

	async function submitTeam() {
		message = '';
		error = '';

		if (!teamNumber.trim() || !name.trim() || !school.trim()) {
			error = t.required;
			return;
		}

		try {
			submitting = true;
			await api.teams.create({
				teamNumber: teamNumber.trim(),
				name: name.trim(),
				school: school.trim(),
				coach: coach.trim() || undefined,
				robotName: robotName.trim() || undefined,
				members: members
					.split('\n')
					.map((member) => member.trim())
					.filter(Boolean)
			});

			message = t.success;
			teamNumber = '';
			name = '';
			school = '';
			coach = '';
			robotName = '';
			members = '';
		} catch (err) {
			console.error('Team registration failed:', err);
			error = t.offline;
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>{t.title} | miniFAnRoC</title>
	<meta name="description" content={t.subtitle} />
</svelte:head>

<div class="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
	<Navbar />

	<main class="mx-auto grid max-w-6xl gap-8 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
		<section class="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-slate-900/70 sm:p-8">
			<div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-white">
				<UsersRound class="h-6 w-6" />
			</div>
			<h1 class="text-3xl font-black tracking-tight sm:text-5xl">{t.title}</h1>
			<p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
				{t.subtitle}
			</p>
		</section>

		<form
			onsubmit={(event) => {
				event.preventDefault();
				void submitTeam();
			}}
			class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70 sm:p-6"
		>
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="space-y-2">
					<span class="text-sm font-semibold">{t.teamNumber}</span>
					<input bind:value={teamNumber} class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950" />
				</label>
				<label class="space-y-2">
					<span class="text-sm font-semibold">{t.teamName}</span>
					<input bind:value={name} class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950" />
				</label>
				<label class="space-y-2 sm:col-span-2">
					<span class="text-sm font-semibold">{t.school}</span>
					<input bind:value={school} class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950" />
				</label>
				<label class="space-y-2">
					<span class="text-sm font-semibold">{t.coach}</span>
					<input bind:value={coach} class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950" />
				</label>
				<label class="space-y-2">
					<span class="text-sm font-semibold">{t.robotName}</span>
					<input bind:value={robotName} class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950" />
				</label>
				<label class="space-y-2 sm:col-span-2">
					<span class="text-sm font-semibold">{t.members}</span>
					<textarea bind:value={members} rows="5" placeholder={t.membersHint} class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950"></textarea>
				</label>
			</div>

			{#if error}
				<p class="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{error}</p>
			{/if}
			{#if message}
				<p class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">{message}</p>
			{/if}

			<button
				type="submit"
				disabled={submitting}
				class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
			>
				<Send class="h-4 w-4" />
				{submitting ? t.submitting : t.submit}
			</button>
		</form>
	</main>

	<Footer />
</div>
