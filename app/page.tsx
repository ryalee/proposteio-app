import React from "react";

export default function Home() {
  return (
    <section className="flex flex-col">
      <div className="p-8 text-[#090e41]">
        <h1 className="font-bold text-3xl">Olá!</h1>
        <p className="text-xl">Pronto para seu próximo projeto?</p>
      </div>

      <div className="flex flex-col bg-linear-to-r from-blue-600 to-[#101970] text-white p-10 rounded-3xl w-[80%] self-center hover:scale-105 transition-all duration-300 shadow-lg gap-2">
        <h2 className="font-bold text-5xl w-[50%]">Crie sua proposta em menos de 1 minuto.</h2>
        <p className="font-[#ececec]">
          Nossa IA entende o desafio do seu cliente e gera um texto persuasivo
          focado nas necessidades dele e agregando valor a sua entrega.
        </p>

        <button className="bg-[#101970] text-white font-semibold p-4 rounded-xl w-[40%] hover:bg-[#090d3f] hover:text-white shadow-lg cursor-pointer mt-4 hover:scale-105 transition-all duration-300">
          Crie agora, é grátis!
        </button>
      </div>
    </section>
  );
}
