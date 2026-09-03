import mongoose from "mongoose";

/**
 * Global-mongoose is used here to maintain a cached connection across hot
 * reloads in development. In Vercel serverless functions the cached value may
 * survive across warm invocations of the same function instance but is NOT
 * guaranteed — the connection is always re-established on cold start.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const getUri = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === "") {
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

  if (!cached.promise) {
    cached.promise = mongoose.connect(getUri(), {
      bufferCommands: false,
      // Atlas-friendly timeouts for serverless cold starts
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset so the next call retries instead of reusing a broken promise
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
