import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { cuid2 } from '../../utils/database';
import { accountsTable } from '../accounts/accounts.model';

export const usersTable = pgTable('users', {
	id: cuid2('id')
		.primaryKey()
		.references(() => accountsTable.id),
	username: text('username').notNull().unique(),
	usernameId: text('username_id').notNull().unique(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});
