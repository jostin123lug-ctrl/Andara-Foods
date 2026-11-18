// DATOS DE DEMOSTRACIÓN. Sin certificaciones ni especificaciones inventadas.
const T = "Ficha técnica pendiente del proveedor";
const p = (slug: string, name: string, category: string, description: string, presentations: string[]) =>
  ({ slug, name, category, description, origin: "Ecuador", presentations, technical: T, isDemo: true });
export const seedProducts = [
  p("cacao-grano", "Cacao en grano", "Cacao y derivados", "Cacao ecuatoriano en grano para industria chocolatera.", ["Por definir"]),
  p("pasta-cacao", "Pasta de cacao", "Cacao y derivados", "Derivado de cacao para fabricantes.", ["Por definir"]),
  p("nibs-cacao", "Nibs de cacao", "Cacao y derivados", "Fragmentos de cacao para uso alimentario.", ["Por definir"]),
  p("mango-deshidratado", "Mango deshidratado", "Frutas procesadas", "Fruta tropical deshidratada.", ["Por definir"]),
  p("pulpa-maracuya", "Pulpa de maracuyá", "Frutas procesadas", "Pulpa de fruta para industria y distribución.", ["Por definir"]),
  p("cafe-tostado", "Café tostado", "Café", "Café tostado de origen ecuatoriano.", ["Por definir"]),
  p("cafe-especialidad", "Café de especialidad", "Café", "Café de especialidad para mercados selectos.", ["Por definir"]),
  p("chifles", "Chifles", "Snacks procesados", "Snack de plátano verde.", ["Por definir"]),
  p("chips-yuca", "Chips de yuca", "Snacks procesados", "Snack de yuca.", ["Por definir"]),
];
export const categories = ["Cacao y derivados", "Frutas procesadas", "Café", "Snacks procesados"];
