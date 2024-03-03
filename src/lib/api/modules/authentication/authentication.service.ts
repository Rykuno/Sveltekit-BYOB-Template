import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/api/utils/lucia';
import { inject, injectable } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import type { SignUpDto } from './dtos/signup.dto';
import type { SignInDto } from './dtos/signin.dto';
import { HTTPException } from 'hono/http-exception';
import { AUTH, type Auth } from './authentication.provider';
import { UsersRepository } from '../users/users.repository';
import { AccountsRepository } from '../accounts/accounts.repository';
import { DB, type Database } from '../persistance/database.provider';

@injectable()
export class AuthenticationService {
	constructor(
		@inject(UsersRepository) private usersRepository: UsersRepository,
		@inject(AccountsRepository) private accountsRepository: AccountsRepository,
		@inject(AUTH) private auth: Auth,
		@inject(DB) private db: Database
	) {}

	async signin(data: SignInDto) {
		const existingAccount = await this.accountsRepository.findOneByEmail(data.email);
		if (!existingAccount)
			throw new HTTPException(StatusCodes.UNAUTHORIZED, { message: 'Invalid email or password' });

		const validPassword = await new Argon2id().verify(existingAccount.password, data.password);
		if (!validPassword)
			throw new HTTPException(StatusCodes.UNAUTHORIZED, { message: 'Invalid email or password' });

		return this.auth.createSession(existingAccount.id, {});
	}

	async signup(data: SignUpDto) {
		const hashedPassword = await new Argon2id().hash(data.password);

		// Check if the username is already taken
		const existingUsername = await this.usersRepository.findOneByUsername(data.username);
		if (existingUsername)
			throw new HTTPException(StatusCodes.BAD_REQUEST, { message: 'Username already taken' });

		// Check if the email is already taken
		const existingEmail = await this.accountsRepository.findOneByEmail(data.email);
		if (existingEmail)
			throw new HTTPException(StatusCodes.BAD_REQUEST, { message: 'Email is already registered' });

		// Create the account and user
		const account = await this.db.transaction(async (trx) => {
			const account = await this.accountsRepository.trxHost(trx).create({
				email: data.email.toLowerCase(),
				password: hashedPassword
			});

			await this.usersRepository.trxHost(trx).create({
				id: account.id,
				username: data.username,
				usernameId: data.username.toLowerCase()
			});

			return account;
		});

		return this.auth.createSession(account.id, {});
	}
}
