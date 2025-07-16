'use client'

import Link from "next/link"
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"
import { ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { NavbarSidebar } from "./navbar-sidebar"
import { MenuIcon } from "lucide-react"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

interface NavbarItemProps {
  href: string
  children: ReactNode
  isActive?: boolean
}

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
  return (
    <Button variant='outline' className={cn(
      "bg-transparent hover:bg-transparent hover:border-primary rounded-full border-transparent px-3.5 text-lg",
      isActive && "bg-black text-white hover:bg-black hover:text-white"
    )}
    >
      <Link href={href}>
        {children}
      </Link>
    </Button>
  )
}

const navbarItems = [
  { href: "/", children: "Home" },
  { href: "/features", children: "Features" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" },
]

export const Navbar = () => {

  const pathname = usePathname()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <nav className="h-20 flex border-b justify-between items-center px-10 bg-white">
      <Link href="/" className="pl-6 flex items-center">
        <span className={cn("text-5xl font-semibold", poppins.className)}>
          Kiuu
        </span>
      </Link>

      <NavbarSidebar items={navbarItems} isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      <div className="lg:flex items-center gap-4 hidden">
        {navbarItems.map((item) => (
          <NavbarItem key={item.href} href={item.href} isActive={pathname === item.href}>
            {item.children}
          </NavbarItem>
        ))}
      </div>

      <div className="lg:flex items-center gap-4 hidden">
        <Button
         // asChild is used to make the button a link
         asChild
         variant='secondary'
         className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg">
          <Link href="/login" className="h-full">
            Login
          </Link>
        </Button>
        <Button
         asChild
         variant='secondary'
         className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:text-black hover:bg-pink-400 transition-colors text-lg">
          <Link href="/start-selling">
            Start selling
          </Link>
        </Button>
      </div>

      <div className="flex lg:hidden items-center justify-center">
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <MenuIcon className="w-6 h-6" />
        </Button>

      </div>
    </nav>
  )
}
