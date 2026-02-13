import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

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
      <body suppressHydrationWarning className="flex flex-col">
        <>
          <Header />

          <main className="mt-30">
            {children}
          </main>
        </>
      </body>
    </html>
  );
}