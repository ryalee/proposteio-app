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
          <header className="flex justify-around items-center p-6 w-full fixed bg-white shadow-sm z-50">
            <h1 className="font-extrabold text-[#101970] text-3xl">Proposteio</h1>

            <div className="text-[#090e41] flex items-center gap-2">
              <h1 className="font-bold text-3xl">Olá!</h1>
              <p className="text-xl">Pronto para seu próximo <span className="font-bold text-green-600">SIM</span>?</p>
            </div>
          </header>

          <main className="mt-30">
            {children}
          </main>
        </>
      </body>
    </html>
  );
}