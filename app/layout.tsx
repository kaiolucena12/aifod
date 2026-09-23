import type {
  Metadata,
} from "next";

import type {
  ReactNode,
} from "react";

import "./globals.css";

import Header from "@/components/Header";


export const metadata: Metadata = {
  title: "AiFod",

  description:
    "AiFod - experiências, conexão e exclusividade",

  icons: {
    icon: "/image/logo.png",
    shortcut: "/image/logo.png",
    apple: "/image/logo.png",
  },
};


export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className="bg-[#0b0908]"
    >
      <body
        className="
          min-h-screen
          bg-[#0b0908]
          text-[#f8f1e8]
          antialiased
        "
      >
        <Header />

        {children}
      </body>
    </html>
  );
}