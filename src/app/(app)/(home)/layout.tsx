import { ReactNode } from "react"
import { Footer } from "./footer"
import { SearchFilters } from "./search-filters"
import { NavbarWrapper } from "./navbar-wrapper"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { CustomCategory } from "@/types"
import { Category } from "@/payload-types"
interface Props {
  children: ReactNode
}

const payload = await getPayload({
  config: configPromise,
})

const data = await payload.find({
  collection: 'categories',
  depth: 1,
  pagination: false,
  where: {
    parent: {
      exists: false,
    },
  },
  sort: "name"
})


const formattedData: CustomCategory[] = data.docs.map((category) => ({
  ...category,
  subcategories: (category.subcategories?.docs ?? []).map((subcategory) => ({
    ...(subcategory as Category),
    subcategories: undefined
  })),
}))


export default function HomeLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarWrapper />
      <SearchFilters data={formattedData} />
      <main className="flex-1 bg-[#F4F4F0]">
        {children}
      </main>
      <Footer />
    </div>
  )
}
