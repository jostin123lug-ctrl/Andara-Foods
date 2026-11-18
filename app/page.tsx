import Catalog from "@/components/Catalog";
import QuoteForm from "@/components/QuoteForm";

const services = ["Exportación directa", "Intermediación comercial", "Búsqueda de proveedores", "Coordinación logística", "Gestión documental", "Seguimiento de pedidos"];
const markets = ["Estados Unidos", "Unión Europea", "China", "Colombia", "Perú"];
const Sec = ({ id, title, children, dark }: any) => (
  <section id={id} className={dark ? "bg-ink text-ivory" : ""}>
    <div className="mx-auto max-w-6xl px-5 py-16"><h2 className="mb-8 text-3xl font-semibold">{title}</h2>{children}</div>
  </section>
);

export default function Home() {
  return (
    <main>
      <header className="bg-ink text-ivory">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm">
          <strong className="tracking-widest text-gold">ANDARA FOODS</strong>
          <div className="flex gap-4"><a href="#productos">Productos</a><a href="#servicios">Servicios</a><a href="#mercados">Mercados</a><a href="#cotizar">Cotizar</a><a href="/panel">Panel</a></div>
        </nav>
        <div className="mx-auto max-w-6xl px-5 py-24">
          <h1 className="max-w-2xl text-4xl font-semibold sm:text-5xl">Conectamos alimentos con el mundo</h1>
          <p className="mt-5 max-w-xl text-ivory/80">Conectamos productores de alimentos con mercados globales mediante exportaciones confiables, gestión comercial integral, coordinación logística y tecnología para la trazabilidad.</p>
          <div className="mt-8 flex gap-3"><a href="#productos" className="btn">Conoce nuestros productos</a><a href="#cotizar" className="btn !bg-transparent border border-gold !text-gold">Solicitar cotización</a></div>
        </div>
      </header>
      <Sec id="productos" title="Productos"><Catalog /></Sec>
      <Sec id="servicios" title="Servicios" dark>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{services.map(s => <div key={s} className="rounded border border-gold/40 p-5">{s}</div>)}</div>
      </Sec>
      <Sec id="mercados" title="Mercados en estudio">
        <div className="flex flex-wrap gap-3">{markets.map(m => <span key={m} className="rounded-full border border-leaf px-4 py-2 text-leaf">{m}</span>)}</div>
        <p className="mt-4 text-sm text-ink/70">Mercados estratégicos a estudiar inicialmente; aún sin operaciones en ellos.</p>
      </Sec>
      <Sec id="cotizar" title="Solicitar cotización"><QuoteForm /></Sec>
      <footer className="bg-ink px-5 py-8 text-center text-xs text-ivory/70">ANDARA FOODS · Contacto: configurable · Sitio con datos de demostración</footer>
    </main>
  );
}
