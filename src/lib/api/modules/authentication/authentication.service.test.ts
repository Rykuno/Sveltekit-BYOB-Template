import 'reflect-metadata';
import { Lucia } from 'lucia';
import { container } from 'tsyringe';
import { faker } from '@faker-js/faker';
import { lucia } from '$lib/api/utils/lucia';
import { createId } from '@paralleldrive/cuid2';
import { PgDatabase } from 'drizzle-orm/pg-core';
import type { SignUpDto } from './dtos/signup.dto';
import { AUTH, type Auth } from './authentication.provider';
import { UsersRepository } from '../users/users.repository';
import { AuthenticationService } from './authentication.service';
import { AccountsRepository } from '../accounts/accounts.repository';
import { DB, type Database } from '../persistance/database.provider';
import { it, afterEach, expect, beforeAll, describe, vi } from 'vitest';

describe('Authentication Service', () => {
	let service: AuthenticationService;
	let usersRepository = vi.mocked(UsersRepository.prototype);
	let accountsRepository = vi.mocked(AccountsRepository.prototype);
	let db = vi.mocked(PgDatabase.prototype);
	let auth = vi.mocked(Lucia.prototype);

	beforeAll(() => {
		service = container
			.register<UsersRepository>(UsersRepository, { useValue: usersRepository })
			.register<AccountsRepository>(AccountsRepository, { useValue: accountsRepository })
			.register<Database>(DB, { useValue: db })
			.register<Auth>(AUTH, { useValue: auth })
			.resolve(AuthenticationService);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('should be defined', () => {
		expect(usersRepository).toBeDefined();
		expect(accountsRepository).toBeDefined();
		expect(db).toBeDefined();
		expect(auth).toBeDefined();
		expect(service).toBeDefined();
	});

	describe('signup', () => {
		const data: SignUpDto = {
			email: faker.internet.email(),
			username: faker.internet.userName(),
			password: faker.internet.password()
		};

		it('should create a new account and user', async () => {
			usersRepository.findOneByUsername = vi.fn().mockResolvedValueOnce(null);
			accountsRepository.findOneByEmail = vi.fn().mockResolvedValueOnce(null);
			auth.createSession = vi.fn().mockResolvedValueOnce(true);
			db.transaction = vi.fn().mockReturnValue({ ...data, id: createId() });

			const spy_db_trx = vi.spyOn(db, 'transaction');
			const spy_auth_createSession = vi.spyOn(auth, 'createSession');

			await expect(service.signup(data)).resolves.toBeDefined();
			expect(spy_db_trx).toBeCalledTimes(1);
			expect(spy_auth_createSession).toBeCalledTimes(1);
		});

		it('should throw an error if username is taken', async () => {
			usersRepository.findOneByUsername = vi.fn().mockResolvedValueOnce(true);
			accountsRepository.findOneByEmail = vi.fn().mockResolvedValueOnce(null);
			await expect(service.signup(data)).rejects.toThrowError();
		});

		it('should throw an error if email is taken', async () => {
			usersRepository.findOneByUsername = vi.fn().mockResolvedValueOnce(null);
			accountsRepository.findOneByEmail = vi.fn().mockResolvedValueOnce(true);
			await expect(service.signup(data)).rejects.toThrowError();
		});
	});
});
