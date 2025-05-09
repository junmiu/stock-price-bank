import type { Knex } from 'knex';
import type { MongoClientOptions } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Helper function to validate required environment variables
function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable "${key}" is required but not defined.`);
  }
  return value;
}

// Validate and load required environment variables
export const MONGODB_URI = getEnvVariable('MONGODB_URI');
export const MONGODB_NAME = getEnvVariable('MONGODB_NAME');
export const MONGODB_COLLECTION = getEnvVariable('MONGODB_COLLECTION');
const MONGODB_USERNAME = getEnvVariable('MONGODB_USERNAME');
const MONGODB_PASSWORD = getEnvVariable('MONGODB_PASSWORD');

export const knexSqlite3Config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './data.db',
  },
  useNullAsDefault: true,
};

export const mongoConfig: MongoClientOptions = {
  auth: {
    username: MONGODB_USERNAME,
    password: MONGODB_PASSWORD,
  },
  directConnection: true,
  connectTimeoutMS: 3000,
};