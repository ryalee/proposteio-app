'use client'

import React from 'react'
import Link from 'next/link'
import { Factory, FolderHeart, Settings, FilePen } from "lucide-react"
import { usePathname } from 'next/navigation'

const NavItems = [
  {
    id: 1,
    icon: Factory,
    name: "Fábrica de Propostas",
    href: "/"
  },
  {
    id: 2,
    icon: FolderHeart,
    name: "Propostas Salvas",
    href: "/propostas-salvas"
  },
  {
    id: 3,
    icon: Settings,
    name: "Configurações",
    href: "/configuracoes"
  }
]

function Header() {
  const pathname = usePathname()

  return (
    <header className="flex justify-between items-center p-6 w-full fixed bg-white shadow-sm z-50">
      <div>
        <h1 className="font-extrabold text-[#101970] text-3xl">Proposteio</h1>
      </div>

      <nav className="w-[50%] flex justify-between">
        {NavItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer
                ${isActive 
                  ? 'bg-[#101970] text-white shadow-lg' 
                  : 'text-gray-500 hover:text-[#101970] hover:bg-gray-100'
                }
              `}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <button className="flex items-center bg-[#101970] text-[#ececec] font-semibold p-4 rounded-xl hover:bg-[#090d3f] hover:text-white transition-all duration-300 shadow-lg cursor-pointer">
        <FilePen className="w-5 h-5 mr-2" />
        Nova Proposta
      </button>
    </header>
  )
}

export default Header;