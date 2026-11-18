# ANDARA FOODS (avance)
Next.js 14 + TypeScript + Tailwind + MongoDB (Mongoose). API en `app/api`.

## Arquitectura
Navegador → componentes React → `/api/products` y `/api/quotes` (Route Handlers) → Mongoose → MongoDB Atlas.
Sin `MONGODB_URI` el sitio funciona en modo demo con `lib/seed-data.ts`.

## Ejecutar
    npm install
    cp .env.example .env.local   # completar MONGODB_URI y SEED_KEY
    npm run dev
    curl -X POST localhost:3000/api/seed -H "x-seed-key: TU_CLAVE"   # carga productos demo

## Editar productos/textos
Productos: `lib/seed-data.ts` (y volver a ejecutar /api/seed). Textos: `app/page.tsx`.

## Deploy (Vercel)
Subir a GitHub, importar en vercel.com, definir `MONGODB_URI` y `SEED_KEY`, Deploy.
En Atlas: Network Access, permitir 0.0.0.0/0 (Vercel usa IPs dinámicas).

## Pendiente
Páginas internas, fotos, trazabilidad, proveedores, contacto, ERP/CRM/blockchain/gemelo digital.
