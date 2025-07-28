"use client"

import { Button } from "@/components/ui/button"
import { cn, generateTenantURL } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { Poppins } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
// import { CheckoutButton } from "@/modules/checkout/ui/components/checkout-button"
import dynamic from "next/dynamic"
import { ShoppingBagIcon } from "lucide-react"

const CheckoutButton = dynamic(() => import("@/modules/checkout/ui/components/checkout-button").then((mod) => mod.CheckoutButton), {
  ssr: false,
  loading: () => <Button disabled className="bg-white"><ShoppingBagIcon className="size-4 text-black" /></Button>,
})

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
          <p className="text-2xl font-bold">{tenant?.name || slug}</p>
        </Link>

        <div className="flex items-center gap-x-2">
          <CheckoutButton tenantSlug={slug} hideIfEmpty />
        </div>

      </div>
    </nav>
  )
}

export const NavbarSkeleton = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex items-center justify-between h-full px-4 lg:px-12">
        <div className=""></div>
        <Button disabled className="bg-white"><ShoppingBagIcon className="size-4 text-black" /></Button>
      </div>
    </nav>
  )
}
