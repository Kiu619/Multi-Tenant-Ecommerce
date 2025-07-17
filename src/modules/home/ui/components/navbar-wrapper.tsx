'use client'

import dynamic from "next/dynamic"

const Navbar = dynamic(() => import('./navbar').then(mod => ({ default: mod.Navbar })), {
  ssr: false,
  loading: () => (
    <nav className="h-20 flex border-b justify-between items-center px-10 bg-white">
      <div className="pl-6 flex items-center">
        <span className="text-5xl font-semibold">Kiuu</span>
      </div>
    </nav>
  )
})

export const NavbarWrapper = () => {
  return <Navbar />
}
