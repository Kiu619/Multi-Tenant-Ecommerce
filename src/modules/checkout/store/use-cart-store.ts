import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface TenantCart {
  productIds: string[]
}

interface CartState {
  tenantCarts: Record<string, TenantCart>
  addProductToCart: (tenantSlug: string, productId: string) => void
  removeProductFromCart: (tenantSlug: string, productId: string) => void
  clearCart: (tenantSlug: string) => void
  clearAllCarts: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
)
