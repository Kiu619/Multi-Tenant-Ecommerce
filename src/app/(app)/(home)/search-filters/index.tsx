"use client"

import { Categories } from "./categories"
import { SearchInput } from "./search-input"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"


export const SearchFilters = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())
  return (
    <div className="flex flex-col gap-4 w-full px-4 lg:px-12 py-8 border-b"
      style={{
        backgroundColor: "#F5F5F5"
      }}
    >
      <SearchInput disabled={false} data={data} />
      <Categories data={data} />
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
