import mongoose from "mongoose";

let cachedDb = global.mongoose;

if (!cachedDb) {
  cachedDb = global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
  if (cachedDb.conn) {
    return cachedDb.conn;
  }
  if (!cachedDb.promise) {
    const opts = {
      bufferCommands: false,
    };
    cachedDb.promise = mongoose
      .connect(`${process.env.MONGODB_URI}/urban`, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  cachedDb.conn = await cachedDb.promise;
  return cachedDb.conn;
}

export default connectDb;
