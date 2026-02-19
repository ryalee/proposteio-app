import Image from "next/image";
import Link from "next/link";
import React from "react";

const plataformas = [
  {
    id: 1,
    name: "Upwork",
    logo: "/upwork.webp",
    borderColor: '#0f8d2050'
  },
  {
    id: 2,
    name: "99freelas",
    logo: "/99freelas.webp",
    borderColor: '#1559d650'
  },
  {
    id: 3,
    name: "Freelancer",
    logo: "/freelancer.webp",
    borderColor: '#13a5af50'
  },
  {
    id: 4,
    name: "Workana",
    logo: "/workana.webp",
    borderColor: '#d83ddd50'
  }
]

export default function Home() {
  return (
    <section className="flex flex-col">
      <div className="flex flex-col bg-linear-to-r from-blue-600 to-[#101970] text-white p-10 rounded-3xl w-[80%] self-center hover:scale-105 transition-all duration-300 shadow-lg gap-2">
        <h1 className="font-bold text-3xl md:text-5xl md:w-[50%]">Crie sua proposta em menos de 1 minuto.</h1>
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

      <div className='mt-20 flex flex-col items-center gap-5'>
        <h2 className="text-2xl text-center font-semibold text-[#101970]">Testado e validado nas maiores plataformas freelancer</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {plataformas.map((plataforma) => (
            <div 
              key={plataforma.id} 
              className='shadow-md border-2 rounded-xl p-2 flex items-center gap-2 w-full md:w-50' 
              style={{ borderColor: plataforma.borderColor }}
            >
              <Image
                src={plataforma.logo}
                alt={plataforma.name}
                width={55}
                height={55}
                className="rounded-xl"
              />
              <h2 className="font-semibold text-[#101970]">{plataforma.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
