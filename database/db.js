import mongoose from "mongoose";
import { env } from "../environment";

const MONGODB_URI = `mongodb+srv://${env.DB_USER_NAME}:${env.DB_PASSWORD}@cluster0.fbngfbs.mongodb.net/?retryWrites=true&w=majority`;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectMongoDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: env.DB_NAME,
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("✅ Successfully connected to MongoDB");
      return mongoose;
    });

    const db = mongoose.connection;
    db.on('error', (err) => console.error("❌ DB connection error:", err));
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectMongoDB;