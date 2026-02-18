import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <section className="flex flex-col">
      <div className="flex flex-col bg-linear-to-r from-blue-600 to-[#101970] text-white p-10 rounded-3xl w-[80%] self-center hover:scale-105 transition-all duration-300 shadow-lg gap-2">
        <h2 className="font-bold text-3xl md:text-5xl md:w-[50%]">Crie sua proposta em menos de 1 minuto.</h2>
        <p className="font-[#ececec]">
          Nossa IA entende o desafio do seu cliente e gera um texto persuasivo
          focado nas necessidades dele e agregando valor a sua entrega.
        </p>

        <Link 
          href={'/nova-proposta'}
          className="bg-[#101970] text-white font-semibold p-4 rounded-xl text-center md:w-[30%] hover:bg-[#090d3f] hover:text-white shadow-lg cursor-pointer mt-4 hover:scale-105 transition-all duration-300"
        >
          Crie agora, é grátis!
        </Link>
      </div>
    </section>
  );
}
