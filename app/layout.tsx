import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TextoLab — Mineração de Texto e PLN",
  icons: { icon: "/favicon.svg" },
  description: "Aprenda a transformar dados textuais em conhecimento com Mineração de Texto e Processamento de Linguagem Natural."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
