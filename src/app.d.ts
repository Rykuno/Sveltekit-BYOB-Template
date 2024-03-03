// See https://kit.svelte.dev/docs/types#app
import type { User } from 'lucia';
import { ClientType } from '$lib/api';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			api: ClientType['api'];
			getAuthedUser: () => Promise<User | null>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
