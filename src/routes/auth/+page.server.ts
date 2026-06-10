import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async () => ({});

function clean(value: FormDataEntryValue | null) {
	const text = value?.toString().trim();
	return text || undefined;
}

function createRegistrationNumber() {
	const stamp = Date.now().toString(36).toUpperCase();
	const random = Math.random().toString(36).slice(2, 6).toUpperCase();
	return `REG-${stamp}-${random}`;
}

function getCopy(locale: string | undefined) {
	return locale === 'en'
		? {
				missingTeam: 'Please complete the team, representative, and mentor teacher information.',
				missingMembers: 'Please complete the name and class for every member.',
				submitFailed: 'Team registration could not be submitted. Please try again.'
			}
		: {
				missingTeam: 'Vui lòng điền đầy đủ thông tin đội, đại diện và giáo viên hướng dẫn.',
				missingMembers: 'Vui lòng điền đầy đủ tên và lớp của từng thành viên.',
				submitFailed: 'Không thể gửi đăng ký đội. Vui lòng thử lại.'
			};
}

export const actions: Actions = {
	register: async ({ request }) => {
		const data = await request.formData();
		const copy = getCopy(clean(data.get('locale')));

		const name = clean(data.get('teamName'));
		const school = clean(data.get('school'));
		const location = clean(data.get('location'));
		const representativeEmail = clean(data.get('representativeEmail'));
		const representativePhone = clean(data.get('representativePhone'));
		const teacherName = clean(data.get('teacherName'));
		const teacherEmail = clean(data.get('teacherEmail'));
		const teacherPhone = clean(data.get('teacherPhone'));
		const memberCount = Math.min(
			4,
			Math.max(1, Number.parseInt(data.get('memberCount')?.toString() || '1', 10))
		);

		if (
			!name ||
			!school ||
			!location ||
			!representativeEmail ||
			!representativePhone ||
			!teacherName ||
			!teacherEmail ||
			!teacherPhone
		) {
			return fail(400, {
				success: false,
				error: copy.missingTeam
			});
		}

		const memberDetails = Array.from({ length: memberCount }, (_, index) => ({
			name: clean(data.get(`memberName${index}`)),
			className: clean(data.get(`memberClass${index}`))
		}));

		if (memberDetails.some((member) => !member.name || !member.className)) {
			return fail(400, {
				success: false,
				error: copy.missingMembers
			});
		}

		try {
			const res = await api.teams.create({
				teamNumber: createRegistrationNumber(),
				name,
				school,
				location,
				representativeEmail,
				representativePhone,
				teacherName,
				teacherEmail,
				teacherPhone,
				coach: teacherName,
				competitionIds: [],
				members: memberDetails.map((member) => member.name as string),
				memberDetails: memberDetails as { name: string; className: string }[]
			});

			return {
				success: true,
				teamNumber: res.data?.team.teamNumber,
				teamName: res.data?.team.name
			};
		} catch (err) {
			console.error('Team registration error:', err);
			const apiError = err as { error?: { message?: string } };
			return fail(400, {
				success: false,
				error: apiError?.error?.message || copy.submitFailed
			});
		}
	},

	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		return { success: true };
	}
};
