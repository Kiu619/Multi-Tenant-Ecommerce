"use client"

import { Button } from "@/components/ui/button"
import { DEFAULT_LIMIT } from "@/constants"
import { useTRPC } from "@/trpc/client"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { InboxIcon } from "lucide-react"
import { Product } from "@/modules/products/types"
import { ProductCard, ProductCardSkeleton } from "./product-card"


export const ProductList = () => {
  const trcp = useTRPC()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(trcp.library.getMany.infiniteQueryOptions(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage: any) => {
        return lastPage?.docs?.length > 0 ? lastPage.nextPage : undefined
      }
    }
  ))

  console.log(data)

  if (data.pages[0]?.docs?.length === 0) {
    return (
      <div className="border border-black border-dashed p-8 flex flex-col gap-y-4 items-center justify-center bg-white w-full rounded-lg">
        <InboxIcon className="size-12 text-black" />
        <p className="text-lg font-medium">No products found</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {(data as any)?.pages.flatMap((page: any) => page.docs).map((product: any, index: number) => (
          <ProductCard
            key={index}
            id={product.id}
            name={product?.name}
            imageUrl={product?.image?.url}
            tenantSlug={product?.tenant?.slug || 'Kiuu'}
            tenantImageUrl={product?.tenant?.image?.url || ''}
            reviewRating={product?.reviewRating || 0}
            reviewCount={product?.reviewCount || 0}
          />
        ))}
      </div>

      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="font-medium disabled:opacity-50 text-base bg-white"
            variant="elevated"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load more'}
          </Button>
        )}
      </div>
    </>
  )
}

export const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
