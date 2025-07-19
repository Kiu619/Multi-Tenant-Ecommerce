import { ProductList, ProductListSkeleton } from "@/modules/products/ui/components/product-list"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"

interface Props {
  params: Promise<{ category: string, subcategory: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { category, subcategory } = await params
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(trpc.products.getMany.queryOptions({ category: subcategory }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={subcategory} />
      </Suspense>
    </HydrationBoundary>
  )
}
