"use client";
import { useEffect, useState } from "react";
import { categories } from "@/lib/seed-data";

type P = { slug: string; name: string; category: string; description: string; origin: string; presentations: string[]; technical: string };

export default function Catalog() {
  const [items, setItems] = useState<P[]>([]);
  const [q, setQ] = useState(""); const [cat, setCat] = useState("");
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [source, setSource] = useState("");

  useEffect(() => {
    setState("loading");
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/products?q=${encodeURIComponent(q)}&category=${encodeURIComponent(cat)}`);
        if (!r.ok) throw new Error();
        const j = await r.json(); setItems(j.data); setSource(j.source); setState("ok");
      } catch { setState("error"); }
    }, 250);
    return () => clearTimeout(t);
  }, [q, cat]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input className="input" placeholder="Buscar producto…" aria-label="Buscar producto" value={q} onChange={e => setQ(e.target.value)} />
        <select className="input sm:w-64" aria-label="Categoría" value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      {state === "loading" && <p>Cargando catálogo…</p>}
      {state === "error" && <p className="text-red-700">No se pudo cargar el catálogo. Intenta nuevamente.</p>}
      {state === "ok" && items.length === 0 && <p>Sin resultados.</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(p => (
          <article key={p.slug} className="overflow-hidden rounded-lg border border-ink/10 bg-white">
            <div className="h-28 bg-gradient-to-br from-ink to-leaf" aria-hidden />
            <div className="p-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-leaf">{p.category}</span>
              <h3 className="mt-1 text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-ink/80">{p.description}</p>
              <p className="mt-2 text-xs">Origen: {p.origin} · Presentaciones: {p.presentations.join(", ")}</p>
              <p className="text-xs italic text-ink/60">{p.technical}</p>
              <a href="#cotizar" onClick={() => window.dispatchEvent(new CustomEvent("pick-product", { detail: p.name }))} className="btn mt-3">Solicitar cotización</a>
            </div>
          </article>
        ))}
      </div>
      {state === "ok" && <p className="mt-4 text-xs text-ink/60">Fuente de datos: {source === "mongodb" ? "MongoDB" : "modo demo (sin base de datos)"} · datos de demostración</p>}
    </div>
  );
}
