import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface TenantCart {
  productIds: string[]
}

interface CartState {
  // Thêm flag để track hydration
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  tenantCarts: Record<string, TenantCart>
  addProductToCart: (tenantSlug: string, productId: string) => void
  removeProductFromCart: (tenantSlug: string, productId: string) => void
  clearCart: (tenantSlug: string) => void
  clearAllCarts: () => void
  getCartByTenant: (tenantSlug: string) => string[]
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      tenantCarts: {},
      addProductToCart: (tenantSlug: string, productId: string) => {
        set((state) => {
          const tenantCart = state.tenantCarts[tenantSlug] || { productIds: [] }
          return {
            tenantCarts: {
              ...state.tenantCarts,
              [tenantSlug]: {
                productIds: [...tenantCart.productIds, productId],
              },
            },
          }
        })
      },
      removeProductFromCart: (tenantSlug: string, productId: string) => {
        set((state) => {
          const tenantCart = state.tenantCarts[tenantSlug] || { productIds: [] }
          return {
            tenantCarts: {
              ...state.tenantCarts,
              [tenantSlug]: {
                productIds: tenantCart.productIds.filter((id) => id !== productId),
              },
            },
          }
        })
      },
      clearCart: (tenantSlug: string) => {
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: { productIds: [] },
          },
        }))
      },
      clearAllCarts: () => {
        set({ tenantCarts: {} })
      },
      getCartByTenant: (tenantSlug: string) => {
        return get().tenantCarts[tenantSlug]?.productIds || []
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
