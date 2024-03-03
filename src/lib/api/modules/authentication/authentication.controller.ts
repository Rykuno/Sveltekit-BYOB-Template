import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import type { User, Session } from 'lucia';
import { lucia } from '$lib/api/utils/lucia';
import { signupDto } from './dtos/signup.dto';
import { inject, injectable } from 'tsyringe';
import { signinDto } from './dtos/signin.dto';
import { zValidator } from '@hono/zod-validator';
import { AuthenticationService } from './authentication.service';
import type { Controller } from '$lib/api/common/interfaces/controller.interface';

@injectable()
export class AuthenticationController implements Controller {
	constructor(
		@inject(AuthenticationService) private authenticationService: AuthenticationService
	) {}

	routes() {
		const app = new Hono<{
			Variables: {
				session: Session | null;
				user: User | null;
			};
		}>();
		return app
			.get('/', async (c) => {
				return c.json(c.var.user);
			})
			.post('/signup', zValidator('json', signupDto), async (c) => {
				const data = await c.req.json();
				const session = await this.authenticationService.signup(data);
				const sessionCookie = lucia.createSessionCookie(session.id);

				setCookie(c, sessionCookie.name, sessionCookie.value, {
					path: sessionCookie.attributes.path,
					maxAge: sessionCookie.attributes.maxAge,
					domain: sessionCookie.attributes.domain,
					sameSite: sessionCookie.attributes.sameSite as any,
					secure: sessionCookie.attributes.secure,
					httpOnly: sessionCookie.attributes.httpOnly,
					expires: sessionCookie.attributes.expires
				});

				return c.json({ session });
			})
			.post('/signin', zValidator('json', signinDto), async (c) => {
				const data = await c.req.json();
				const session = await this.authenticationService.signin(data);
				const sessionCookie = lucia.createSessionCookie(session.id);

				setCookie(c, sessionCookie.name, sessionCookie.value, {
					path: sessionCookie.attributes.path,
					maxAge: sessionCookie.attributes.maxAge,
					domain: sessionCookie.attributes.domain,
					sameSite: sessionCookie.attributes.sameSite as any,
					secure: sessionCookie.attributes.secure,
					httpOnly: sessionCookie.attributes.httpOnly,
					expires: sessionCookie.attributes.expires
				});

				return c.json({ session });
			});
	}
}
