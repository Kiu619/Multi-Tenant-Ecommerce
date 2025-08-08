import { DEFAULT_LIMIT } from "@/constants"
import { Media, Tenant } from "@/payload-types"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({
      productId: z.string(),
    }))

    .query(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: 'products',
        id: input.productId,
      })

      if (!product) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
      }

      const reviewsData = await ctx.payload.find({
        collection: 'reviews',
        limit: 1,
        pagination: false,
        where: {
          and: [
            {
              product: {
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

      const review = reviewsData.docs[0] || null

      return review
    }),
  create: protectedProcedure
    .input(z.object({
      productId: z.string(),
      description: z.string().min(1, 'Description must be at least 1 character'),
      rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    }))

    .mutation(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: 'products',
        id: input.productId,
      })

      if (!product) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
      }

      const existingReviews = await ctx.payload.find({
        collection: 'reviews',
        limit: 1,
        pagination: false,
        where: {
          and: [
            {
              product: {
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

      if (existingReviews.docs.length > 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'You have already reviewed this product' })
      }

      const review = await ctx.payload.create({
        collection: 'reviews',
        data: {
          product: product.id,
          user: ctx.session?.user?.id,
          description: input.description,
          rating: input.rating,
        },
      })

      return review
    }),
  update: protectedProcedure
    .input(z.object({
      reviewId: z.string(),
      description: z.string().min(1, 'Description must be at least 1 character'),
      rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    }))

    .mutation(async ({ ctx, input }) => {
      const existingReview = await ctx.payload.findByID({
        depth: 0,
        collection: 'reviews',
        id: input.reviewId,
      })

      if (!existingReview) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Review not found' })
      }

      if (existingReview.user !== ctx.session?.user?.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to update this review' })
      }

      const updatedReview = await ctx.payload.update({
        collection: 'reviews',
        id: input.reviewId,
        data: {
          description: input.description,
          rating: input.rating,
        },
      })

      return updatedReview
    })
})
