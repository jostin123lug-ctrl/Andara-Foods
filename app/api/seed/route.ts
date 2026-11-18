import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { seedProducts } from "@/lib/seed-data";

export async function POST(req: Request) {
  if (!process.env.SEED_KEY || req.headers.get("x-seed-key") !== process.env.SEED_KEY)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const db = await connectDB();
  if (!db) return NextResponse.json({ error: "MONGODB_URI no configurada" }, { status: 400 });
  await Product.bulkWrite(seedProducts.map(p => ({ updateOne: { filter: { slug: p.slug }, update: { $set: p }, upsert: true } })));
  return NextResponse.json({ ok: true, count: seedProducts.length });
}
