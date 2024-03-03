import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { parseApiResponse } from '$lib/utils';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();

		const email = form.get('email') as string;
		const password = form.get('password') as string;

		const { status } = await parseApiResponse(
			locals.api.authentication.signin.$post({
				json: { email, password }
			})
		);

		if (status === 200) {
			throw redirect(307, '/');
		}
	}
};
