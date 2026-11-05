import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

const globalForMongo = globalThis as typeof globalThis & {
  booknookMongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.booknookMongoClient ??
  new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo.booknookMongoClient = mongoClient;
}

export const db = mongoClient.db(
  process.env.DB_NAME || "booknook"
);