// Setting up a connection to the 'wxdu' database in the mongodb

import {MongoClient} from 'mongodb';

const uri = process.env.MONGO_URI;
if (!uri) throw new Error('MONGO_URI not set');

let cached = global._mongo || {conn: null, promise: null};

export default async function connectToMongoDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        const client = new MongoClient(uri);
        cached.promise = client.connect().then(() => {
            return {client, db: client.db(process.env.MONGO_DB || 'wxdu')};
        })
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
