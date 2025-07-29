import { Button } from "@/components/ui/button"
import { cn, generateTenantURL } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"
import { ShoppingBagIcon } from "lucide-react"

interface Props {
  className?: string
  hideIfEmpty?: boolean
  tenantSlug: string
}

export const CheckoutButton = ({ className, hideIfEmpty, tenantSlug }: Props) => {
  const cart = useCart(tenantSlug)

  if (!cart.productIds) {
    return (
      <Button
        disabled
        variant="elevated"
        className={cn("bg-white", className)}
      >
        <ShoppingBagIcon className="size-4" />
      </Button>
    )
  }

  if (hideIfEmpty && cart.totalItems === 0) return null

  return (
    <Button
      variant="elevated"
      className={cn("bg-white", className)}
      asChild
    >
      <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
        <ShoppingBagIcon className="size-4" /> {cart.totalItems > 0 ? cart.totalItems : ""}
      </Link>
    </Button>
  )
}
