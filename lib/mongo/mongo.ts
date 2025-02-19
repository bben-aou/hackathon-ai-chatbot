import { MongoClient } from 'mongodb';
 

export const mongoDbClient = new MongoClient(process.env.MONGODB_URI ?? '');