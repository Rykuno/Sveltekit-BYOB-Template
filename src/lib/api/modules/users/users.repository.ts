import { usersTable } from './users.model';
import { inject, injectable } from 'tsyringe';
import { HTTPException } from 'hono/http-exception';
import { eq, type InferInsertModel } from 'drizzle-orm';
import type { Transaction } from '$lib/api/utils/database';
import { DB, type Database } from '../persistance/database.provider';
import type { Repository } from '$lib/api/common/interfaces/repository.interface';

@injectable()
export class UsersRepository implements Repository {
	constructor(@inject(DB) private db: Database) {}

	async findOneById(id: string) {
		const [user] = await this.db.select().from(usersTable).where(eq(usersTable.id, id));
		return user;
	}

	async findOneByIdOrThrow(id: string) {
		const user = await this.findOneById(id);
		if (!user) throw new HTTPException(404, { message: 'User not found' });
		return user;
	}

	async findOneByUsername(username: string) {
		const [user] = await this.db
			.select()
			.from(usersTable)
			.where(eq(usersTable.usernameId, username.toLowerCase()));

		return user;
	}

	async create(data: InferInsertModel<typeof usersTable>) {
		const [user] = await this.db.insert(usersTable).values(data).returning();
		return user;
	}

	trxHost(trx: Transaction) {
		return new UsersRepository(trx);
	}
}
