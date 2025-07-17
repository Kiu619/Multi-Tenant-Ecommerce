"use client"

import { Categories } from "./categories"
import { SearchInput } from "./search-input"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { BreadcrumbNavigation } from "./breadcrum-navigation"


export const SearchFilters = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())

  const params = useParams()

  const categoryParam = params.category as string | undefined
  const activeCategory = categoryParam || 'all'

  const activeCategoryData = data.find((category) => category.slug === activeCategory)
  const activeCategoryColor = activeCategoryData?.color || '#F5F5F5'
  const activeCategoryName = activeCategoryData?.name || 'All'

  const activeSubcategory = params.subcategory as string | undefined
  const activeSubcategoryName = activeCategoryData?.subcategories?.find((subcategory) => subcategory.slug === activeSubcategory)?.name || ''

  return (
    <div className="flex flex-col gap-4 w-full px-4 lg:px-12 py-8 border-b"
      style={{
        backgroundColor: activeCategoryColor
      }}
    >
      <SearchInput disabled={false} data={data} />
      <Categories data={data} />

      <BreadcrumbNavigation
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategoryName}
      />
    </div>
  )
}

export const SearchFiltersLoading = () => {
  return (
    <div className="flex flex-col gap-4 w-full px-4 lg:px-12 py-8 border-b">
      <SearchInput disabled={false} data={[]} />
      <div className="h-11 hidden lg:block"></div>
    </div>
  )
}
