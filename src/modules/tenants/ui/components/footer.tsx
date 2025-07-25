import { cn } from "@/lib/utils"
import Link from "next/link"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

export const Footer = () => {
  return (
    <nav className="border-t font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex items-center h-full px-4 lg:px-12 gap-2 py-6">
        <p>Powered by</p>
        <Link href="https://kiuu.com" target="_blank">
          <span className={cn(poppins.className, "text-xl font-bold")}>Kiuu</span>
        </Link>
      </div>
    </nav>
  )
}
