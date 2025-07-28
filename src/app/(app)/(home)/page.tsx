import { DEFAULT_LIMIT } from "@/constants"
import { productFiltersLoader } from "@/hooks/use-product-filters-server"
import { ProductListView } from "@/modules/products/ui/views/product-list-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { SearchParams } from "nuqs/server"
interface Props {
  searchParams: Promise<SearchParams>
}

export default async function HomePage({ searchParams }: Props) {
  const filters = await productFiltersLoader(searchParams)
  
  const queryClient = getQueryClient()
  await queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({ limit: DEFAULT_LIMIT, ...filters }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  )
}
