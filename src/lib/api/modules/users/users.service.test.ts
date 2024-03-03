import 'reflect-metadata';
import { expect, describe, it, beforeAll, vi, afterEach } from 'vitest';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { container } from 'tsyringe';
import { HTTPException } from 'hono/http-exception';
import { createId } from '@paralleldrive/cuid2';
import { faker } from '@faker-js/faker';

describe('Users Service', () => {
	let service: UsersService;
	let usersRepository = vi.mocked(UsersRepository.prototype);

	beforeAll(() => {
		service = container
			.register<UsersRepository>(UsersRepository, { useValue: usersRepository })
			.resolve(UsersService);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('should be defined', () => {
		expect(usersRepository).toBeDefined();
		expect(service).toBeDefined();
	});

	it('should get a user by id', async () => {
		const mock_user = {
			id: createId(),
			username: faker.internet.userName(),
			hashedPassword: faker.internet.password()
		};

		usersRepository.findOneById = vi.fn().mockResolvedValueOnce(mock_user);
		const spy_usersRepository_findOneById = vi.spyOn(usersRepository, 'findOneById');

		const user = await service.findOneById(mock_user.id);
		expect(user.id).toEqual(mock_user.id);
		expect(spy_usersRepository_findOneById).toBeCalledTimes(1);
	});

	it('should throw when a user is not found', async () => {
		usersRepository.findOneByIdOrThrow = vi
			.fn()
			.mockRejectedValueOnce(new HTTPException(401, { message: 'User not found' }));

		await expect(service.findOneByIdOrThrow('1')).rejects.toThrow(HTTPException);
	});
});
