import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import Supplier from "@/models/Supplier";

const schema = z.object({
  company: z.string().min(2).max(120), country: z.string().min(2).max(60),
  contact: z.string().min(2).max(80), email: z.string().email(),
  phone: z.string().max(30).optional(), products: z.string().min(2).max(300),
  capacity: z.string().max(200).optional(), certifications: z.string().max(300).optional(),
  description: z.string().max(1000).optional(),
});

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No autorizado: ingresa la clave de administración" }, { status: 401 });
  const db = await connectDB();
  if (!db) return NextResponse.json({ error: "Base de datos no conectada" }, { status: 503 });
  return NextResponse.json({ data: await Supplier.find().sort({ createdAt: -1 }).limit(100).lean() });
}

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Base de datos no conectada" }, { status: 503 });
    await Supplier.create(parsed.data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo registrar el proveedor" }, { status: 500 });
  }
}
