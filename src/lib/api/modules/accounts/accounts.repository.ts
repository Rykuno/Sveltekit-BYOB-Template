import { inject, injectable } from 'tsyringe';
import { accountsTable } from './accounts.model';
import { eq, type InferInsertModel } from 'drizzle-orm';
import type { Transaction } from '$lib/api/utils/database';
import { DB, type Database } from '../persistance/database.provider';
import type { Repository } from '$lib/api/common/interfaces/repository.interface';

@injectable()
export class AccountsRepository implements Repository {
	constructor(@inject(DB) private db: Database) {}

	async create(data: InferInsertModel<typeof accountsTable>) {
		const [account] = await this.db.insert(accountsTable).values(data).returning();
		return account;
	}

	async findOneByEmail(email: string) {
		const [account] = await this.db
			.select()
			.from(accountsTable)
			.where(eq(accountsTable.email, email.toLowerCase()));
		return account;
	}

	trxHost(trx: Transaction) {
		return new AccountsRepository(trx);
	}
}
