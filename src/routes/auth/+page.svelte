<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import Warning from 'phosphor-svelte/lib/Warning';
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { getLocale } from '$lib/paraglide/runtime';

	let { form } = $props();

	let memberCount = $state(2);
	const memberIndexes = $derived(Array.from({ length: memberCount }, (_, index) => index));
	const locale = $derived(getLocale() as 'en' | 'vi');
	const text = $derived.by(() =>
		locale === 'vi'
			? {
					title: 'Đăng ký đội thi',
					metaDescription: 'Đăng ký thông tin đội thi miniFAnRoC',
					description: 'Cung cấp thông tin đội để ban tổ chức liên hệ, xác minh và gửi các thông báo cần thiết.',
					errorTitle: 'Không thể gửi đăng ký',
					successTitle: 'Đã ghi nhận thông tin đăng ký',
					successPrefix: 'Thông tin đội',
					successSuffix: 'đã được lưu với mã đăng ký',
					successNote: 'Ban tổ chức sẽ liên hệ qua thông tin đại diện đã cung cấp.',
					teamInfo: 'Thông tin đội',
					teamName: 'Tên đội *',
					teamNamePlaceholder: 'Ví dụ: Saigon Sparks',
					school: 'Trường đang theo học *',
					schoolPlaceholder: 'Ví dụ: Trường THPT ...',
					location: 'Khu vực của đội *',
					locationPlaceholder: 'Tỉnh/thành phố, quận/huyện',
					representativeEmail: 'Email đại diện nhận thông tin *',
					emailPlaceholder: 'email@example.com',
					representativePhone: 'Số điện thoại đại diện *',
					phonePlaceholder: '09xxxxxxxx',
					members: 'Thành viên đội',
					memberHelp: 'Chọn số lượng thành viên chính thức của đội. Mỗi đội có tối đa 4 thành viên.',
					memberCountLabel: 'Số lượng thành viên',
					memberTitle: 'Thành viên',
					memberName: 'Họ và tên thành viên *',
					fullNamePlaceholder: 'Họ và tên',
					memberClass: 'Lớp đang học *',
					classPlaceholder: 'Ví dụ: 10A1',
					teacher: 'Giáo viên hướng dẫn',
					teacherHelp: 'Thông tin này giúp ban tổ chức liên hệ khi cần xác nhận hoặc gửi thông báo chính thức.',
					teacherName: 'Họ và tên giáo viên *',
					teacherEmail: 'Email giáo viên *',
					teacherPhone: 'Số điện thoại giáo viên *',
					submit: 'Gửi thông tin đăng ký'
				}
			: {
					title: 'Team registration',
					metaDescription: 'Register a miniFAnRoC team',
					description: 'Share your team information so the organizers can contact, verify, and send important updates.',
					errorTitle: 'Registration could not be submitted',
					successTitle: 'Registration information received',
					successPrefix: 'Team',
					successSuffix: 'has been saved with registration code',
					successNote: 'The organizers will contact the representative using the information provided.',
					teamInfo: 'Team information',
					teamName: 'Team name *',
					teamNamePlaceholder: 'Example: Saigon Sparks',
					school: 'School *',
					schoolPlaceholder: 'Example: ... High School',
					location: 'Team location *',
					locationPlaceholder: 'Province/city, district',
					representativeEmail: 'Representative email for updates *',
					emailPlaceholder: 'email@example.com',
					representativePhone: 'Representative phone number *',
					phonePlaceholder: '09xxxxxxxx',
					members: 'Team members',
					memberHelp: 'Select the official number of team members. Each team can have up to 4 members.',
					memberCountLabel: 'Number of members',
					memberTitle: 'Member',
					memberName: 'Member full name *',
					fullNamePlaceholder: 'Full name',
					memberClass: 'Current class *',
					classPlaceholder: 'Example: 10A1',
					teacher: 'Mentor teacher',
					teacherHelp: 'This helps the organizers contact the team when confirmation or official updates are needed.',
					teacherName: 'Teacher full name *',
					teacherEmail: 'Teacher email *',
					teacherPhone: 'Teacher phone number *',
					submit: 'Submit registration'
				}
	);
</script>

<svelte:head>
	<title>{text.title} - miniFAnRoC</title>
	<meta name="description" content={text.metaDescription} />
</svelte:head>

<Navbar />

<section class="min-h-screen bg-slate-50 px-4 py-24 text-slate-950 dark:bg-slate-950 dark:text-white">
	<div class="mx-auto w-full max-w-4xl">
		<Card.Root class="overflow-hidden rounded-2xl border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
			<form method="POST" action="?/register" use:enhance>
				<input type="hidden" name="locale" value={locale} />
				<Card.Header class="border-b border-neutral-200 dark:border-neutral-800">
					<Card.Title class="text-3xl font-bold tracking-tight">{text.title}</Card.Title>
					<Card.Description class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
						{text.description}
					</Card.Description>
				</Card.Header>

				<Card.Content class="flex flex-col gap-8 p-6">
					{#if form?.error}
						<Alert.Root variant="destructive" class="rounded-lg">
							<Warning data-slot="icon" />
							<Alert.Title>{text.errorTitle}</Alert.Title>
							<Alert.Description>{form.error}</Alert.Description>
						</Alert.Root>
					{/if}

					{#if form?.success}
						<Alert.Root class="rounded-lg border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
							<CheckCircle data-slot="icon" />
							<Alert.Title>{text.successTitle}</Alert.Title>
							<Alert.Description>
								{text.successPrefix} {form.teamName} {text.successSuffix} {form.teamNumber}. {text.successNote}
							</Alert.Description>
						</Alert.Root>
					{/if}

					<section class="grid gap-4 md:grid-cols-2">
						<div class="md:col-span-2">
							<h2 class="text-lg font-semibold">{text.teamInfo}</h2>
						</div>

						<Field.Field>
							<Field.FieldLabel for="teamName">{text.teamName}</Field.FieldLabel>
							<Input id="teamName" name="teamName" required placeholder={text.teamNamePlaceholder} />
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel for="school">{text.school}</Field.FieldLabel>
							<Input id="school" name="school" required placeholder={text.schoolPlaceholder} />
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel for="location">{text.location}</Field.FieldLabel>
							<Input id="location" name="location" required placeholder={text.locationPlaceholder} />
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel for="representativeEmail">{text.representativeEmail}</Field.FieldLabel>
							<Input
								id="representativeEmail"
								name="representativeEmail"
								type="email"
								required
								placeholder={text.emailPlaceholder}
							/>
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel for="representativePhone">{text.representativePhone}</Field.FieldLabel>
							<Input
								id="representativePhone"
								name="representativePhone"
								type="tel"
								required
								placeholder={text.phonePlaceholder}
							/>
						</Field.Field>
					</section>

					<section class="grid gap-4">
						<div class="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
							<div class="flex items-center justify-between gap-4">
								<div>
									<h2 class="text-lg font-semibold">{text.members}</h2>
									<p class="text-sm text-neutral-500 dark:text-neutral-400">
										{text.memberHelp}
									</p>
								</div>
								<div class="rounded-full bg-neutral-900 px-3 py-1 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900">
									{memberCount}/4
								</div>
							</div>

							<input type="hidden" name="memberCount" value={memberCount} />
							<input
								type="range"
								min="1"
								max="4"
								step="1"
								bind:value={memberCount}
								class="h-2 w-full accent-neutral-900 dark:accent-white"
								aria-label={text.memberCountLabel}
							/>
						</div>

						<div class="grid gap-4 md:grid-cols-2">
							{#each memberIndexes as index}
								<div class="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
									<h3 class="mb-4 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
										{text.memberTitle} {index + 1}
									</h3>
									<div class="grid gap-3">
										<Field.Field>
											<Field.FieldLabel for={`memberName${index}`}>{text.memberName}</Field.FieldLabel>
											<Input
												id={`memberName${index}`}
												name={`memberName${index}`}
												required
												placeholder={text.fullNamePlaceholder}
											/>
										</Field.Field>
										<Field.Field>
											<Field.FieldLabel for={`memberClass${index}`}>{text.memberClass}</Field.FieldLabel>
											<Input
												id={`memberClass${index}`}
												name={`memberClass${index}`}
												required
												placeholder={text.classPlaceholder}
											/>
										</Field.Field>
									</div>
								</div>
							{/each}
						</div>
					</section>

					<section class="grid gap-4 md:grid-cols-3">
						<div class="md:col-span-3">
							<h2 class="text-lg font-semibold">{text.teacher}</h2>
							<p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
								{text.teacherHelp}
							</p>
						</div>

						<Field.Field>
							<Field.FieldLabel for="teacherName">{text.teacherName}</Field.FieldLabel>
							<Input id="teacherName" name="teacherName" required placeholder={text.fullNamePlaceholder} />
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel for="teacherEmail">{text.teacherEmail}</Field.FieldLabel>
							<Input id="teacherEmail" name="teacherEmail" type="email" required placeholder="teacher@example.com" />
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel for="teacherPhone">{text.teacherPhone}</Field.FieldLabel>
							<Input id="teacherPhone" name="teacherPhone" type="tel" required placeholder={text.phonePlaceholder} />
						</Field.Field>
					</section>
				</Card.Content>

				<Card.Footer class="border-t border-neutral-200 p-6 dark:border-neutral-800">
					<Button type="submit" class="w-full rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100">
						{text.submit}
					</Button>
				</Card.Footer>
			</form>
		</Card.Root>
	</div>
</section>

<Footer />
