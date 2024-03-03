import { container } from 'tsyringe';
import { db } from '$lib/api/utils/database';

export const DB = Symbol('DATABASE');
export type Database = typeof db;
container.register(DB, { useValue: db });
