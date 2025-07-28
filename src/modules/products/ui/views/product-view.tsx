"use client"

import { StarRating } from "@/components/star-rating"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatPrice, generateTenantURL } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { LinkIcon, PlusIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Fragment } from "react"
// import { CartButton } from "../ui/components/cart-button"
import dynamic from "next/dynamic"

const CartButton = dynamic(() => import("../components/cart-button")
  .then((mod) => mod.CartButton), {
  ssr: false,
  loading: () => <Button disabled className="flex-1 bg-pink-400">Loading...</Button>,
})

interface ProductViewProps {
  productId: string
  tenantSlug: string
}

export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {

  const trcp = useTRPC()
  const { data: product } = useSuspenseQuery(trcp.products.getOne.queryOptions({ id: productId }))

  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={product.image?.url || "/placeholder.png"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">

            <div className="p-6">
              <h1 className="text-4xl font-medium">{product.name}</h1>
            </div>

            <div className="border-y flex">
              <div className="px-6 py-4 flex items-center justify-around border-r">
                <div className="relative px-2 py-1 border bg-pink-400 w-fit">
                  <p className="text-base font-medium">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                <Link href={`${generateTenantURL(tenantSlug)}`} className="flex items-center gap-2">
                  {product.tenant?.image?.url && (
                    <Image
                      src={product.tenant.image.url}
                      alt={product.tenant.name || tenantSlug}
                      width={24}
                      height={24}
                      className="rounded-full border shrink-0 size-[24px]"
                    />
                  )}
                  <p className="text-base underline font-medium">
                    {product.tenant?.name || tenantSlug}
                  </p>
                </Link>
              </div>

              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <div className="flex items-center gap-1">
                  <StarRating rating={4} iconClassName="size-4" />
                </div>
              </div>
            </div>

            <div className="block lg:hidden px-6 -py-4 items-center justify-center border-b">
              <div className="flex items-center gap-1">
                <StarRating rating={4} iconClassName="size-4" />

                <p className="text-base font-medium">
                  {4} ratings
                </p>
              </div>
            </div>

            <div className="px-6">
              {product.description ? (
                <p className="text-base">
                  {product.description}
                </p>
              ) : (
                <p className="text-base font-medium text-muted-foreground italic">No description</p>
              )}
            </div>

          </div>

          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l h-full">
              <div className="flex flex-col gap-4 p-6 border-b">
                <div className="flex flex-row items-center gap-2">
                  <CartButton tenantSlug={tenantSlug} productId={productId} />
                  <Button
                    variant="elevated"
                    className="size-12"
                    onClick={() => { }}
                    disabled={false}
                  >
                    <LinkIcon className="size-4" />
                  </Button>
                </div>

                <p className="text-center font-medium">
                  {product.refundPolicy === "no-refund" ? "No refund" : `${product.refundPolicy} money back guarantee`}
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">
                    Ratings
                  </h3>

                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p>({4})</p>
                    <p className="text-base">
                      {4} ratings
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4 items-center">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <Fragment key={star}>
                      <div className="font-medium">{star} {star === 1 ? "star" : "stars"}</div>

                      <Progress
                        value={5}
                        className="h-[1lh]"
                      />

                      <div className="font-medium">
                        {0}%
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>


            </div>
          </div>
        </div>

      </div>
    </div>
  )
}