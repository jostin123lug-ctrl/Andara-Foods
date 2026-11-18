import mongoose from "mongoose";
const g = global as any;
const cache = g._mongoose || (g._mongoose = { conn: null, promise: null });
/** Devuelve null si MONGODB_URI no está configurada (modo demo). */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (cache.conn) return cache.conn;
  cache.promise ||= mongoose.connect(uri, { bufferCommands: false });
  cache.conn = await cache.promise;
  return cache.conn;
}
