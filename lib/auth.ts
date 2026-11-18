/** Protege acciones de administración con la clave SEED_KEY (cabecera x-seed-key). */
export const isAdmin = (req: Request) =>
  !!process.env.SEED_KEY && req.headers.get("x-seed-key") === process.env.SEED_KEY;
