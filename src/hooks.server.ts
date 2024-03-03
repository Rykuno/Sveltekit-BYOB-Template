import { hc } from 'hono/client';
import type { AppType } from '$lib/api';
import type { Handle } from '@sveltejs/kit';
import { parseApiResponse } from '$lib/utils';
import { sequence } from '@sveltejs/kit/hooks';

const apiClient: Handle = async ({ event, resolve }) => {
	const { api } = hc<AppType>('/', { fetch: event.fetch });

	async function getAuthedUser() {
		const { data } = await parseApiResponse(api.authentication.$get());
		return data;
	}

	event.locals.api = api;
	event.locals.getAuthedUser = getAuthedUser;

	const response = await resolve(event);
	return response;
};

export const handle = sequence(apiClient);
