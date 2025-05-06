import { knex, Knex } from 'knex';
import { createReferencesTable, createSymbolsTable } from './schema';

export type Symbol = { code: string, name: string };
export type Reference = { base: number; symbol: number, date: string, rate: number };

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './data.db',
  },
  useNullAsDefault: true,
};

export const db = knex(config);

(async () => {
  await createSymbolsTable(db);
  await createReferencesTable(db);
})();