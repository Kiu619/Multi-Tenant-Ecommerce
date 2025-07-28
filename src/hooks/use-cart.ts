import { useCartStore } from "@/modules/checkout/store/use-cart-store"

export const useCart = (tenantSlug: string) => {
  const {
    addProductToCart,
    removeProductFromCart,
    clearCart,
    clearAllCarts,
    getCartByTenant,
    _hasHydrated,
  } = useCartStore()

  // Sử dụng trực tiếp từ store, nhưng return empty nếu chưa hydrated
  const productIds = _hasHydrated ? getCartByTenant(tenantSlug) : []

  const toggleProductInCart = (productId: string) => {
    if (productIds.includes(productId)) {
      removeProductFromCart(tenantSlug, productId)
    } else {
      addProductToCart(tenantSlug, productId)
    }
  }

  const isProductInCart = (productId: string) => {
    return productIds.includes(productId)
  }

  const clearTenantCart = () => {
    clearCart(tenantSlug)
  }

  return {  
    productIds,
    addProductToCart: (productId: string) => addProductToCart(tenantSlug, productId),
    removeProductFromCart: (productId: string) => removeProductFromCart(tenantSlug, productId),
    toggleProductInCart,
    clearCart: clearTenantCart,
    clearAllCarts,
    isProductInCart,
    totalItems: productIds.length,
    hasHydrated: _hasHydrated,
  }
}
