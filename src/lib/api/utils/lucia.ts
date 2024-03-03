import { Lucia } from 'lucia';
import { db } from './database';
import { dev } from '$app/environment';
import { usersTable } from '../modules/users/users.model';
import { sessionsTable } from '../modules/sessions/sessions.model';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			username: attributes.username
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
}
