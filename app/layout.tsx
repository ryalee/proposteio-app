import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proposteio",
  description: "Gerador de propostas com IA para freelancers que estão cansados de perder tempo criando do zero e não obtendo retorno.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        supreessedHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
