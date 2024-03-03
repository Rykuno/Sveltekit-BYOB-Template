import type { Config } from 'drizzle-kit';

export default {
	out: './db/migrations',
	// in poptaro's codebase, 'schema' refers to TypeBox objects (abstraction of a JSON schema), while 'model' refers to database entities/tables, which is what drizzle refers to as 'schema'
	schema: './src/**/*.model.ts',
	breakpoints: false,
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL
	}
} satisfies Config;
