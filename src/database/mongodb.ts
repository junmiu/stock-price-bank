import { mongoConfig, MONGODB_URI, MONGODB_NAME, MONGODB_COLLECTION } from './config';
import { MongoClient, Collection } from 'mongodb';

const client = new MongoClient(MONGODB_URI, mongoConfig);

let _db: Collection;

export const db = () => {
  return _db;
};

export const run = async () => {
  try {
    await client.connect();
    _db = client.db(MONGODB_NAME).collection(MONGODB_COLLECTION);
  } catch (error) {
  } finally {
  }
}