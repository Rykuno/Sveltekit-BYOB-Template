import { z } from 'zod';

export const signinDto = z.object({
	email: z.string().email(),
	password: z.string().max(255)
});
export type SignInDto = z.infer<typeof signinDto>;
