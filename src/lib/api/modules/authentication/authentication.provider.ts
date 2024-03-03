import { container } from 'tsyringe';
import { lucia } from '$lib/api/utils/lucia';

export const AUTH = Symbol('LUCIA');
export type Auth = typeof lucia;
container.register(AUTH, { useValue: lucia });
