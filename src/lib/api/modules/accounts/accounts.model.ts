import { cuid2 } from '../../utils/database';
import { createId } from '@paralleldrive/cuid2';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const accountsTable = pgTable('accounts', {
	id: cuid2('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	email: text('email').unique().notNull(),
	password: text('password').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});
