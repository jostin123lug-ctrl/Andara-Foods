import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { seedProducts } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().slice(0, 60);
  const category = searchParams.get("category") || "";
  try {
    const db = await connectDB();
    if (!db) { // modo demo sin base de datos
      const data = seedProducts.filter(x =>
        (!category || x.category === category) &&
        (!q || x.name.toLowerCase().includes(q.toLowerCase())));
      return NextResponse.json({ source: "demo", data });
    }
    const filter: any = {};
    if (category) filter.category = category;
    if (q) filter.name = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    const data = await Product.find(filter).sort({ category: 1, name: 1 }).lean();
    return NextResponse.json({ source: "mongodb", data });
  } catch {
    return NextResponse.json({ error: "No se pudo obtener el catálogo" }, { status: 500 });
  }
}

import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { categories } from "@/lib/seed-data";
const pSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.enum(categories as [string, ...string[]]),
  description: z.string().max(500).optional(), origin: z.string().max(60).optional(),
  presentations: z.string().max(200).optional(), technical: z.string().max(500).optional(),
});
export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No autorizado: ingresa la clave de administración" }, { status: 401 });
  const parsed = pSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const d = parsed.data;
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Base de datos no conectada" }, { status: 503 });
    const slug = d.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await Product.create({ ...d, slug, origin: d.origin || "Ecuador", presentations: (d.presentations || "").split(",").map(s => s.trim()).filter(Boolean), technical: d.technical || "Ficha técnica pendiente", isDemo: false });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar (¿ya existe un producto con ese nombre?)" }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const slug = new URL(req.url).searchParams.get("slug");
  const db = await connectDB();
  if (!db || !slug) return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  await Product.deleteOne({ slug });
  return NextResponse.json({ ok: true });
}
