import { Category } from "@/payload-types"
import type Stripe from "stripe"

export type CustomCategory = Category & {
  subcategories: Category[]
}

export type ProductMetadata = {
  stripeAccountId: string
  id: string
  name: string
  price: number
}

export type CheckoutMetadata = {
  userId: string
}

export type ExpandedLineItem = Stripe.LineItem & {
  price: Stripe.Price & {
    product: Stripe.Product & {
      metadata: ProductMetadata
    }
  }
}
