import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ANDARA FOODS | Conectamos alimentos con el mundo",
  description: "Exportación internacional de alimentos y productos procesados desde Ecuador.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
