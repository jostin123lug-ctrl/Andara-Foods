"use client";
import { useCallback, useEffect, useState } from "react";
import { categories } from "@/lib/seed-data";

const TABS: Record<string, string> = { products: "Productos", quotes: "Cotizaciones", suppliers: "Proveedores" };
const H = (k: string) => ({ "Content-Type": "application/json", "x-seed-key": k });
const F = ({ n, l, type = "text", req = true }: any) => (
  <label className="text-sm">{l}<input name={n} type={type} required={req} className="input mt-1" /></label>
);

export default function Panel() {
  const [key, setKey] = useState("");
  const [st, setSt] = useState<any>(null);
  const [tab, setTab] = useState("products");
  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStatus = useCallback(async () => {
    try { setSt(await (await fetch("/api/status")).json()); }
    catch { setSt({ connected: false, reason: "No se pudo consultar la API" }); }
  }, []);

  const loadRows = useCallback(async () => {
    if (!st?.connected) return;
    setLoading(true); setMsg("");
    try {
      const r = await fetch(`/api/${tab}`, { headers: H(key) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Error");
      setRows(j.source === "demo" ? [] : j.data);
    } catch (e: any) { setRows([]); setMsg(e.message); }
    setLoading(false);
  }, [tab, key, st]);

  useEffect(() => { loadStatus(); }, [loadStatus]);
  useEffect(() => { loadRows(); }, [tab, st]); // eslint-disable-line

  async function send(e: React.FormEvent<HTMLFormElement>, url: string) {
    e.preventDefault(); const form = e.currentTarget;
    const r = await fetch(url, { method: "POST", headers: H(key), body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const j = await r.json();
    if (r.ok) { form.reset(); setMsg("Guardado en la base de datos ✔"); loadStatus(); loadRows(); }
    else setMsg(j.error || "Error");
  }
  async function del(slug: string) {
    const r = await fetch(`/api/products?slug=${slug}`, { method: "DELETE", headers: H(key) });
    if (r.ok) { setMsg("Eliminado ✔"); loadStatus(); loadRows(); } else setMsg("No autorizado");
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <a href="/" className="text-sm text-leaf">← Volver al sitio</a>
      <h1 className="mt-2 text-3xl font-semibold">Panel de administración</h1>

      <section className={`mt-6 rounded-lg border p-5 ${st?.connected ? "border-leaf bg-leaf/10" : "border-red-300 bg-red-50"}`} aria-live="polite">
        {!st && <p>Comprobando conexión…</p>}
        {st?.connected && (<>
          <p className="font-semibold text-leaf">● Conectado a MongoDB · base de datos: {st.database}</p>
          <p className="mt-1 text-sm">Registros reales: {st.counts.products} productos · {st.counts.quotes} cotizaciones · {st.counts.suppliers} proveedores</p>
        </>)}
        {st && !st.connected && <p className="font-semibold text-red-700">● Sin conexión: {st.reason}</p>}
        <button onClick={loadStatus} className="btn mt-3">Probar conexión</button>
      </section>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <label className="text-sm">Clave de administración (SEED_KEY)
          <input type="password" value={key} onChange={e => setKey(e.target.value)} className="input mt-1 w-72" />
        </label>
        <button onClick={loadRows} className="btn">Consultar</button>
      </div>

      <div className="mt-6 flex gap-2 border-b border-ink/20">
        {Object.entries(TABS).map(([k, v]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 text-sm ${tab === k ? "border-b-2 border-gold font-semibold" : "text-ink/60"}`}>{v}</button>
        ))}
      </div>
      {msg && <p role="status" className="mt-4 text-sm font-medium">{msg}</p>}
      {loading && <p className="mt-4">Consultando…</p>}
      {!st?.connected && st && <p className="mt-4 text-sm">Conecta la base de datos para consultar y guardar registros.</p>}

      {st?.connected && (<div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-semibold">Registros en la base de datos ({rows.length})</h2>
          {!loading && rows.length === 0 && <p className="text-sm text-ink/60">No hay registros todavía.</p>}
          <ul className="space-y-2">
            {rows.map((r: any) => (
              <li key={r._id} className="rounded border border-ink/10 bg-white p-3 text-sm">
                {tab === "products" && (<div className="flex justify-between gap-2">
                  <span><strong>{r.name}</strong> · {r.category}{r.isDemo && <em className="ml-1 text-xs text-ink/50">(demo)</em>}</span>
                  <button onClick={() => del(r.slug)} className="text-xs text-red-700 underline">Eliminar</button></div>)}
                {tab === "quotes" && (<span><strong>{r.company}</strong> pide {r.quantity} {r.unit} de {r.product} → {r.destCountry} · <em>{r.status}</em> · {new Date(r.createdAt).toLocaleString("es-EC")}</span>)}
                {tab === "suppliers" && (<span><strong>{r.company}</strong> ({r.country}) · {r.products} · {r.email}</span>)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          {tab === "products" && (<form onSubmit={e => send(e, "/api/products")} className="grid gap-3">
            <h2 className="font-semibold">Agregar producto</h2>
            <F n="name" l="Nombre" />
            <label className="text-sm">Categoría<select name="category" className="input mt-1">{categories.map(c => <option key={c}>{c}</option>)}</select></label>
            <F n="description" l="Descripción" req={false} /><F n="presentations" l="Presentaciones (separadas por coma)" req={false} />
            <button className="btn">Guardar producto</button></form>)}
          {tab === "suppliers" && (<form onSubmit={e => send(e, "/api/suppliers")} className="grid gap-3">
            <h2 className="font-semibold">Registrar proveedor</h2>
            <F n="company" l="Empresa" /><F n="country" l="País" /><F n="contact" l="Contacto" /><F n="email" l="Correo" type="email" />
            <F n="products" l="Productos que comercializa" /><F n="capacity" l="Capacidad de producción" req={false} />
            <button className="btn">Guardar proveedor</button></form>)}
          {tab === "quotes" && <p className="text-sm text-ink/70">Las cotizaciones llegan desde el formulario público del sitio (sección “Solicitar cotización”). Envía una y pulsa “Consultar”.</p>}
        </div>
      </div>)}
    </main>
  );
}
