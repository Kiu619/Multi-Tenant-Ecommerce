"use client"

import { cn, generateTenantURL } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { Poppins } from "next/font/google"
import Link from "next/link"
import Image from "next/image"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

interface NavbarProps {
  slug: string
}

export const Navbar = ({ slug }: NavbarProps) => {
  const trpc = useTRPC()
  const { data: tenant } = useQuery(trpc.tenants.getOne.queryOptions({ slug }))

  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex items-center justify-between h-full px-4 lg:px-12">
        <Link href={generateTenantURL(slug)}>
          {tenant?.image?.url && (
            <Image
              src={tenant?.image?.url ?? ""}
              alt={slug}
              width={32}
              height={32}
              className="rounded-full border shrink-0"
            />
          )}
          <p className={cn(poppins.className, "text-2xl")}>{tenant?.name}</p>
        </Link>

      </div>
    </nav>
  )
}

export const NavbarSkeleton = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex items-center justify-between h-full px-4 lg:px-12">

      </div>
    </nav>
  )
}
