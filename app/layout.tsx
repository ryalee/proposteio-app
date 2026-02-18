import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

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
          <header className="flex flex-col gap-2 items-center p-6 w-full fixed bg-white shadow-sm z-50">
            <Link href={'/'} className="font-extrabold text-[#101970] text-3xl">Proposteio</Link>
            <p className="text-sm text-gray-600">Seu parceiro gerador de propostas</p>
          </header>

          <main className="mt-40">
            {children}
          </main>
        </>
      </body>
    </html>
  );
}