import mongoose from "mongoose";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const getUri = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === "") {
    // Fail fast instead of silently connecting to an unintended default
    // instance, and never leak a connection string or credentials.
    throw new Error(
      "MONGODB_URI environment variable is not defined. " +
        "Provide it in your environment or a local .env.local (see .env.example)."
    );
  }
  return uri;
};

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = getUri();

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
