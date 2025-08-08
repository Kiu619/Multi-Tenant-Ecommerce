import { DEFAULT_LIMIT } from "@/constants"
import { Media, Tenant } from "@/payload-types"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
      .input(z.object({
        productId: z.string(),
    }))

    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const data = await ctx.payload.find({
        collection: 'orders',
        limit: 1,
        pagination: false,
        where: {
          and: [
            {
              products: {
                equals: input.productId,
              }
            },
            {
              user: {
                equals: ctx.session?.user?.id,
              }
            }
          ]
        }
      })

      const order = data.docs[0]

      if (!order) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' })
      }

      const product = await ctx.payload.findByID({
        collection: 'products',
        id: input.productId,
      })

      if (!product) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
      }

      return product
    }),
  getMany: protectedProcedure
    .input(z.object({
      cursor: z.number().default(1),
      limit: z.number().default(DEFAULT_LIMIT),
    }))

    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const data = await ctx.payload.find({
        collection: 'orders',
        depth: 0,
        limit: input.limit,
        page: input.cursor,
        where: {
          user: {
            equals: ctx.session?.user?.id,
          }
        }
      })

      const productIds = data.docs.map((doc) => doc.products)

      const productsData = await ctx.payload.find({
        collection: 'products',
        pagination: false,
        where: {
          id: {
            in: productIds,
          }
        }
      })

      const dataWithSummarizeReviews = await Promise.all(
        productsData.docs.map(async (doc) => {
          const reviews = await ctx.payload.find({
            collection: 'reviews',
            where: {
              product: {
                equals: doc.id,
              }
            }
          })
          return {
            ...doc,
            reviewCount: reviews.totalDocs,
            reviewRating: reviews.docs.reduce((acc, review) => acc + (review.rating ?? 0), 0) / reviews.totalDocs,
          }
        })
      )

      return {
        ...productsData,
        docs: dataWithSummarizeReviews.map((doc) => ({
          ...doc,
          imageUrl: (doc.image as Media | null),
          tenant: doc.tenant as Tenant & { image: Media | null }
        }))
      }
    })
})
