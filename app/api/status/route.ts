import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Quote from "@/models/Quote";
import Supplier from "@/models/Supplier";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ connected: false, reason: "MONGODB_URI no está configurada" });
    const [products, quotes, suppliers] = await Promise.all([
      Product.countDocuments(), Quote.countDocuments(), Supplier.countDocuments(),
    ]);
    return NextResponse.json({ connected: true, database: mongoose.connection.name, counts: { products, quotes, suppliers } });
  } catch {
    return NextResponse.json({ connected: false, reason: "No se pudo conectar (revisa la cadena y el acceso de red en Atlas)" });
  }
}
