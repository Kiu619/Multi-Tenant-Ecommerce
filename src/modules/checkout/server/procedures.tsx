import { stripe } from "@/lib/stripe"
import { CheckoutMetadata, ProductMetadata } from "@/types"
import { Media, Tenant } from "@/payload-types"
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init"
import { TRPCError } from "@trpc/server"
import type Stripe from "stripe"
import { z } from "zod"

export const checkoutRouter = createTRPCRouter({

  purchase: protectedProcedure
    .input(z.object({
      productIds: z.array(z.string()).min(1),
      tenantSlug: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.payload.find({
        collection: 'products',
        depth: 2,
        where: {
          and: [
            {
              id: {
                in: input.productIds,
              }
            },
            {
              "tenant.slug": {
                equals: input.tenantSlug,
              }
            }
          ]
        }
      })

      if (products.totalDocs !== input.productIds.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Some products were not found',
        })
      }

      const tenantData = await ctx.payload.find({
        collection: 'tenants',
        depth: 2,
        limit: 1,
        pagination: false,
        where: {
          slug: {
            equals: input.tenantSlug,
          }
        },
      })

      if (!tenantData.docs[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tenant not found',
        })
      }

      const tenant = tenantData.docs[0]

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = 
        products.docs.map((product) => ({
          quantity: 1,
          price_data: {
            unit_amount: product.price * 100,
            currency: 'usd',
            product_data: {
              name: product.name,
              metadata: {
                stripeAccountId: tenant.stripeAccountId,
                id: product.id,
                name: product.name,
                price: product.price,
              } as ProductMetadata
            }
          }
        }))

      const checkout = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        customer_email: ctx.session.user.email,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
        invoice_creation: {
          enabled: true,
        },
        metadata: {
          userId: ctx.session.user.id,
        } as CheckoutMetadata
      })

      if (!checkout.url) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create checkout session',
        })
      }

      return {
        url: checkout.url,
      }
    }),

  getProducts: baseProcedure
    .input(z.object({
      ids: z.array(z.string()),
    }))

    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: 'products',
        depth: 2,
        where: {
          id: {
            in: input.ids,
          },
        },
      })

      if (data.totalDocs !== input.ids.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Some products were not found',
        })
      }

      return {
        ...data,
        totalPrice: data.docs.reduce((acc, doc) => acc + doc.price, 0),
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null }
        }))
      }
    })
})
