import type { Transaction } from '$lib/api/utils/database';

export interface Repository {
	trxHost(trx: Transaction): Repository;
}
