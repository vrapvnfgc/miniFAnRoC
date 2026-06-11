import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return {
		fieldId: params.field_id
	};
};
