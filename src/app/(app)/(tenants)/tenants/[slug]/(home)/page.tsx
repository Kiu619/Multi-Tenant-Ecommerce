import { DEFAULT_LIMIT } from "@/constants"
import { productFiltersLoader } from "@/hooks/use-product-filters-server"
import { ProductListView } from "@/modules/products/ui/views/product-list-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { SearchParams } from "nuqs/server"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

export default async function TenantPage({ params, searchParams }: Props) {
  const { slug } = await params 
  const filters = await productFiltersLoader(searchParams)
  
  const queryClient = getQueryClient()
  await queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({ tenantSlug: slug, limit: DEFAULT_LIMIT, ...filters }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} narrowView />
    </HydrationBoundary>
  )
}