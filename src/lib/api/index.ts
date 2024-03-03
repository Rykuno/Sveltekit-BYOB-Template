import 'reflect-metadata';
import { Hono } from 'hono';
import './register-providers';
import { hc } from 'hono/client';
import { container } from 'tsyringe';
import type { Session } from 'lucia';
import { UsersController } from './modules/users/users.controller';
import { extractAuthedUserMiddleare } from './common/guards/auth.guard';
import { AuthenticationController } from './modules/authentication/authentication.controller';

/* -------------------------------------------------------------------------- */
/*                                     App                                    */
/* -------------------------------------------------------------------------- */
const app = new Hono<{
	Variables: {
		session: Session | null;
	};
}>().basePath('/api');

app.use('*', extractAuthedUserMiddleare);

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
app.get('/', (c) => c.json({ message: 'Hello World!' }));
const routes = app
	.route('/users', container.resolve(UsersController).routes())
	.route('/authentication', container.resolve(AuthenticationController).routes());

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */
export default app;
export type AppType = typeof routes;

export const client = hc<AppType>('/');
export type ClientType = typeof client;
