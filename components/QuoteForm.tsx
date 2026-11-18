"use client";
import { useEffect, useState } from "react";

export default function QuoteForm() {
  const [product, setProduct] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const h = (e: any) => setProduct(e.detail);
    window.addEventListener("pick-product", h);
    return () => window.removeEventListener("pick-product", h);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus("sending");
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    try {
      const r = await fetch("/api/quotes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json();
      if (!r.ok) { setStatus("error"); setMsg(j.error || "Error"); return; }
      setStatus("done"); setMsg(j.persisted ? "¡Solicitud recibida! Te contactaremos pronto." : j.message);
      form.reset(); setProduct("");
    } catch { setStatus("error"); setMsg("Error de conexión"); }
  }

  const f = (name: string, label: string, type = "text", req = true) => (
    <label className="text-sm">{label}
      <input name={name} type={type} required={req} className="input mt-1" />
    </label>
  );
  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      {f("company", "Empresa compradora")}{f("country", "País")}
      {f("contact", "Nombre del contacto")}{f("email", "Correo electrónico", "email")}
      {f("phone", "Teléfono", "tel", false)}
      <label className="text-sm">Producto solicitado
        <input name="product" required value={product} onChange={e => setProduct(e.target.value)} className="input mt-1" />
      </label>
      {f("quantity", "Cantidad requerida", "number")}
      <label className="text-sm">Unidad
        <select name="unit" className="input mt-1"><option>kg</option><option>toneladas</option><option>contenedores</option></select>
      </label>
      {f("destCountry", "País de destino")}{f("port", "Puerto de destino", "text", false)}
      <label className="text-sm">Frecuencia de compra
        <select name="frequency" className="input mt-1"><option>Única</option><option>Mensual</option><option>Trimestral</option><option>Anual</option></select>
      </label>
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <label className="text-sm sm:col-span-2">Observaciones
        <textarea name="notes" rows={3} className="input mt-1" />
      </label>
      <div className="sm:col-span-2">
        <button className="btn" disabled={status === "sending"}>{status === "sending" ? "Enviando…" : "Enviar solicitud"}</button>
        {status === "done" && <p role="status" className="mt-3 text-leaf">{msg}</p>}
        {status === "error" && <p role="alert" className="mt-3 text-red-700">{msg}</p>}
        <p className="mt-2 text-xs text-ink/60">Integración con CRM: función pendiente.</p>
      </div>
    </form>
  );
}
