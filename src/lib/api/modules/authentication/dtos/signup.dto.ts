import { z } from 'zod';

export const signupDto = z.object({
	email: z.string().email(),
	username: z.string().min(3).max(255),
	password: z.string().min(8).max(255)
});
export type SignUpDto = z.infer<typeof signupDto>;
