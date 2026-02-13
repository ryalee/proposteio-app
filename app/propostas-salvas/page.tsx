import PropostaSalvaCard from '@/components/PropostaSalvaCard';
import { PlusCircle, Search } from 'lucide-react';
import React from 'react'

function propostasSalvas() {
  const SearchIcon = Search;

  return (
    <section className='flex flex-col'>
      <div>
        <h1>Estruturas Salvas</h1>
        <p>Propostas salvas para reutilização. Edite-as como quiser.</p>
      </div>

      {/* area de busca */}
      <div className='flex items-center w-[90%] shadow-[0px_0px_5px_1px_rgba(136,136,136,0.5)] rounded-2xl py-3 px-4 self-center'>
        <Search className='w-6 h-6 mr-2 text-[#888]'/>
        <input 
          type="text"
          placeholder=' Buscar estruturas salvas...'
          className='placeholder:text-[#888] w-full focus:outline-none'
        />
      </div>

      {/* display das propostas salvas */}
      <div>
        <PropostaSalvaCard/>
      </div>
    </section>
  )
}

export default propostasSalvas;