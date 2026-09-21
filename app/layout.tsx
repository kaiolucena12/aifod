import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export const metadata: Metadata = {
  title: "AiFod | Experiências e companhia social",
  description: "Protótipo premium de marketplace de companhia social e experiências legais."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
