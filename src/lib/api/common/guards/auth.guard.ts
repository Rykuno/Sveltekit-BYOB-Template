import { lucia } from '$lib/api/utils/lucia';
import { createMiddleware } from 'hono/factory';
import { StatusCodes } from 'http-status-codes';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';

export const authState = (authState: 'authed' | 'unauthed') =>
	createMiddleware(async (c, next) => {
		const user = c.var.user;
		if (authState === 'authed' && !user)
			throw new HTTPException(StatusCodes.FORBIDDEN, { message: 'Unauthorized' });
		if (authState === 'unauthed' && user)
			throw new HTTPException(StatusCodes.FORBIDDEN, { message: 'Unauthorized' });
		return next();
	});

export const extractAuthedUserMiddleare = createMiddleware(async (c, next) => {
	const sessionId = getCookie(c, 'auth_session');

	if (!sessionId) {
		c.set('session', null);
		c.set('user', null);
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const cookie = lucia.createSessionCookie(session.id);
		setCookie(c, cookie.name, cookie.value, {
			path: cookie.attributes.path,
			maxAge: cookie.attributes.maxAge,
			domain: cookie.attributes.domain,
			sameSite: cookie.attributes.sameSite as any,
			secure: cookie.attributes.secure,
			httpOnly: cookie.attributes.httpOnly,
			expires: cookie.attributes.expires
		});
	}
  
	if (!session) {
		const cookie = lucia.createBlankSessionCookie();
		setCookie(c, cookie.name, cookie.value, {
			path: cookie.attributes.path,
			maxAge: cookie.attributes.maxAge,
			domain: cookie.attributes.domain,
			sameSite: cookie.attributes.sameSite as any,
			secure: cookie.attributes.secure,
			httpOnly: cookie.attributes.httpOnly,
			expires: cookie.attributes.expires
		});
	}

	c.set('session', session);
	c.set('user', user);
	return next();
});
