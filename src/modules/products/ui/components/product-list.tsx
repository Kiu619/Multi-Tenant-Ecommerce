"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Product } from "../../types"
import { useProductFilters } from "@/hooks/use-product-filters"

interface Props {
  category?: string
}

export const ProductList = ({ category }: Props) => {

  const [filters] = useProductFilters()

  const trcp = useTRPC()
  const { data } = useSuspenseQuery(trcp.products.getMany.queryOptions({ category, ...filters }))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {(data as any)?.docs.map((product: Product) => (
        <div key={product.id} className="border rounded-md bg-white p-4">
          <h2 className="text-xl font-medium">{product.name}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}

export const ProductListSkeleton = () => {
  return (
    <div>
      {/* <Skeleton
        className="w-full h-48"
      /> */}
      loading...
    </div>
  )
}