import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Props {
  tenantSlug: string
  productId: string
  isPurchased?: boolean
}

export const CartButton = ({ tenantSlug, productId, isPurchased }: Props) => {
  const cart = useCart(tenantSlug)

  if (isPurchased) {
    return (
      <Button variant="elevated" className="flex-1 bg-pink-400" asChild>
        <Link prefetch href={`/library/${productId}`}>
          View in library
        </Link>
      </Button>
    )
  }

  return (
    <Button
      variant="elevated"
      className={cn(
        "flex-1 bg-pink-400",
        cart.isProductInCart(productId) && "bg-white"
      )}
      onClick={() => cart.toggleProductInCart(productId)}
    >
      {cart.isProductInCart(productId) ? (
        "Remove from cart"
      ) : (
        "Add to cart"
      )}
    </Button>
  )
}
