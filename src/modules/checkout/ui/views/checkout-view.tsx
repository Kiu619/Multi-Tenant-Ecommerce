"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { useCart } from "@/hooks/use-cart"
import { useEffect } from "react"
import { toast } from "sonner"
import { generateTenantURL } from "@/lib/utils"
import { CheckoutItem } from "../components/checkout-item"
import { CheckoutSidebar } from "../components/checkout-sidebar"
import { InboxIcon, LoaderIcon } from "lucide-react"
import { useCheckoutStates } from "@/hooks/use-checkout-states"
import { useRouter } from "next/navigation"
import { DEFAULT_LIMIT } from "@/constants"

interface Props {
  tenantSlug: string
}

export const CheckoutView = ({ tenantSlug }: Props) => {
  const router = useRouter()
  const [states, setStates] = useCheckoutStates()
  
  const { productIds, removeProductFromCart, clearCart } = useCart(tenantSlug)
  const trpc = useTRPC()
  
  const queryClient = useQueryClient()

  // Chỉ enable query sau khi đã hydrated và có productIds
  const { data: products, error, isLoading } = useQuery({
    ...trpc.checkout.getProducts.queryOptions({ ids: productIds || [] }),
    enabled: (productIds?.length || 0) > 0
  })

  const purchase = useMutation(trpc.checkout.purchase.mutationOptions({
    onMutate: () => {
      setStates({
        success: false,
        cancel: false,
      })
    },
    onSuccess: (data) => {
      window.location.href = data.url
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in")
        toast.error("You must be logged in to purchase products")
      }
    }
  }))

  useEffect(() => {
    if (states.success) {
      setStates({
        success: false,
        cancel: false,
      })
      clearCart()
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryOptions({
        limit: DEFAULT_LIMIT
      }))
      router.push("/library")
    }
  }, [states.success, queryClient, router, trpc.library.getMany, clearCart, setStates])

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart()
      toast.error("Some products were not found, so we cleared your cart")
    }
  }, [clearCart, error])

  if (productIds?.length === 0) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed p-8 flex flex-col gap-y-4 items-center justify-center bg-white w-full rounded-lg">
          <InboxIcon className="size-12 text-black" />
          <p className="text-lg font-medium">Your cart is empty</p>
        </div>
      </div>
    )
  }

  // Hiển thị loading khi đang fetch products
  if (isLoading) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed p-8 flex flex-col gap-y-4 items-center justify-center bg-white w-full rounded-lg">
          <LoaderIcon className="text-muted-foreground animate-spin" />
          <p className="text-lg font-medium">Loading products...</p>
        </div>
      </div>
    )
  }

  // Hiển thị khi không tìm thấy products
  if (products?.totalDocs === 0) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed p-8 flex flex-col gap-y-4 items-center justify-center bg-white w-full rounded-lg">
          <InboxIcon className="size-12 text-black" />
          <p className="text-lg font-medium">No products found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {products?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                isLast={index === products.docs.length - 1}
                imageUrl={product?.image?.url}
                name={product.name}
                productUrl={`${generateTenantURL(tenantSlug)}/products/${product.id}`}
                tenantUrl={generateTenantURL(tenantSlug)}
                tenantName={product?.tenant?.name || "Unknown Store"}
                price={product.price}
                onRemove={() => {
                  removeProductFromCart(product.id)
                }}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <CheckoutSidebar
            totalPrice={products?.totalPrice || 0}
            onPurchase={() => {
              purchase.mutate({
                productIds: productIds || [],
                tenantSlug,
              })
            }}
            isCanceled={states.cancel}
            isPending={purchase.isPending}
          />
        </div>
      </div>
    </div>
  )
}
