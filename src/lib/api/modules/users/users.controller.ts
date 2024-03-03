import { Hono } from 'hono';
import { inject, injectable } from 'tsyringe';
import { HTTPException } from 'hono/http-exception';
import { UsersRepository } from './users.repository';

@injectable()
export class UsersController {
	constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}

	routes() {
		const app = new Hono();
		return app
			.get('/', (c) => {
				return c.json({ message: 'Hello World!' });
			})
			.get('/:id', async (c) => {
				const { id } = c.req.param();
				const user = await this.usersRepository.findOneByIdOrThrow(id);
				return c.json(user);
			});
	}
}
