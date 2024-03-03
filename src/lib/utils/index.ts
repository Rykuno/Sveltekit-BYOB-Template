import type { ClientResponse } from 'hono/client';

export async function parseApiResponse<T>(fetchCall: Promise<ClientResponse<T>>) {
	const response = await fetchCall;
	if (!response.ok) {
		const error = await response.text();
		return { data: null, error, status: response.status };
	}
	const data = await response.json();
	return { data, error: null, status: response.status };
}
