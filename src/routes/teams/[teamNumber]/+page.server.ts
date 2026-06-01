import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const teamNumber = params.teamNumber;

	if (!teamNumber) {
		throw error(400, 'Team number is required');
	}

	return {
		teamNumber
	};
};
