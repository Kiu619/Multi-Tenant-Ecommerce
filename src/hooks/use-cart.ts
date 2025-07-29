import { useCartStore } from "@/modules/checkout/store/use-cart-store"
import { useCallback } from "react"
import { useShallow } from "zustand/react/shallow"

export const useCart = (tenantSlug: string) => {

  const addProductToCart = useCartStore((state) => state.addProductToCart)
  const removeProductFromCart = useCartStore((state) => state.removeProductFromCart)
  const clearCart = useCartStore((state) => state.clearCart)
  const clearAllCarts = useCartStore((state) => state.clearAllCarts)

  const productIds = useCartStore(useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || []))

  const toggleProductInCart = useCallback((productId: string) => {
    if (productIds?.includes(productId)) {
      removeProductFromCart(tenantSlug, productId)
    } else {
      addProductToCart(tenantSlug, productId)
    }
  }, [productIds, addProductToCart, removeProductFromCart, tenantSlug])

  const isProductInCart = useCallback((productId: string) => {
    return productIds?.includes(productId)
  }, [productIds])

  const clearTenantCart = useCallback(() => {
    clearCart(tenantSlug)
  }, [clearCart, tenantSlug])

  const handleAddProductToCart = useCallback((productId: string) => {
    addProductToCart(tenantSlug, productId)
  }, [addProductToCart, tenantSlug])

  const handleRemoveProductFromCart = useCallback((productId: string) => {
    removeProductFromCart(tenantSlug, productId)
  }, [removeProductFromCart, tenantSlug])

  return {  
    productIds,
    addProductToCart: handleAddProductToCart,
    removeProductFromCart: handleRemoveProductFromCart,
    toggleProductInCart,
    clearCart: clearTenantCart,
    clearAllCarts,
    isProductInCart,
    totalItems: productIds?.length || 0,
  }
}
