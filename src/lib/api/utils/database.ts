import postgres from 'postgres';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction, customType } from 'drizzle-orm/pg-core';
import { drizzle, type PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';

export const client = postgres('postgresql://postgres@localhost:5432/postgres');
export const db = drizzle(postgres('postgresql://postgres@localhost:5432/postgres'));

export type Transaction = PgTransaction<
	PostgresJsQueryResultHKT,
	Record<string, never>,
	ExtractTablesWithRelations<Record<string, never>>
>;

export const cuid2 = customType<{ data: string }>({
	dataType() {
		return 'text';
	}
});
