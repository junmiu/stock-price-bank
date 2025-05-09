import { run as sqlite3Run, db as sqlite3DB } from './sqlite3';
import { run as mongoRun, db as mongoDB } from './mongodb';

export type Symbol = { code: string, name: string };
export type Reference = { base: number; symbol: number, date: string, rate: number };

export const db = {
  sqlite3: sqlite3DB,
  mongo: mongoDB,
};

(async () => {
  await sqlite3Run();
  await mongoRun();
})();