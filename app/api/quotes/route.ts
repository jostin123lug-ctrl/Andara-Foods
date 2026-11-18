import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Quote from "@/models/Quote";

const schema = z.object({
  company: z.string().min(2).max(120), country: z.string().min(2).max(60),
  contact: z.string().min(2).max(80), email: z.string().email(),
  phone: z.string().max(30).optional(), product: z.string().min(2).max(120),
  quantity: z.coerce.number().positive(), unit: z.string().max(20),
  destCountry: z.string().min(2).max(60), port: z.string().max(80).optional(),
  frequency: z.string().max(40).optional(), notes: z.string().max(1000).optional(),
  website: z.string().max(0).optional(), // honeypot anti-spam
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const { website, ...data } = parsed.data;
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ ok: true, persisted: false, message: "Base de datos no configurada: solicitud validada pero no guardada (modo demo)." }, { status: 202 });
    const doc = await Quote.create(data);
    return NextResponse.json({ ok: true, persisted: true, id: String(doc._id) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo registrar la solicitud" }, { status: 500 });
  }
}

import { isAdmin } from "@/lib/auth";
export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No autorizado: ingresa la clave de administración" }, { status: 401 });
  const db = await connectDB();
  if (!db) return NextResponse.json({ error: "Base de datos no conectada" }, { status: 503 });
  return NextResponse.json({ data: await Quote.find().sort({ createdAt: -1 }).limit(100).lean() });
}
