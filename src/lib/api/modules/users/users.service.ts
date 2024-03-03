import { Argon2id } from 'oslo/password';
import { inject, injectable } from 'tsyringe';
import { UsersRepository } from './users.repository';

@injectable()
export class UsersService {
	constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}

	async findOneById(id: string) {
		return this.usersRepository.findOneById(id);
	}

	async findOneByIdOrThrow(id: string) {
		return this.usersRepository.findOneByIdOrThrow(id);
	}
}
