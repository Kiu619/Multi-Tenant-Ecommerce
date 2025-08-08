import { DEFAULT_LIMIT } from "@/constants"
import { sortOptions } from "@/hooks/use-product-filters-server"
import { Category, Media, Tenant } from "@/payload-types"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { CustomCategory } from "@/types"
import { headers as getHeader } from "next/headers"
import { Sort, Where } from "payload"
import { z } from "zod"

export const productsRouter = createTRPCRouter({

  getOne: baseProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const headers = await getHeader()
      const session = await ctx.payload.auth({ headers })

      const product = await ctx.payload.findByID({ 
        collection: 'products', 
        id: input.id, 
        depth: 2
      })

      let isPurchased = false

      if (session?.user) {
        const orders = await ctx.payload.find({
          collection: 'orders',
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                user: {
                  equals: session.user.id,
                },
              },
              {
                products: {
                  equals: input.id,
                },
              }
            ]
          }
        })

        if (orders.docs.length > 0) {
          isPurchased = true
        }
      }

      const reviews = await ctx.payload.find({
        collection: 'reviews',
        where: {
          product: {
            equals: input.id,
          }
        }
      })

      const reviewRating = 
        reviews.docs.length > 0 ? reviews.docs.reduce((acc, review) => acc + (review.rating ?? 0), 0) / reviews.docs.length : 0

      const ratingDistribution: Record<number, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      }

      if (reviews.totalDocs > 0) {
        reviews.docs.forEach((review) => {
          const rating = review.rating

          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1
          }
        })

        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key)
          
          const count = ratingDistribution[rating] || 0
          ratingDistribution[rating] = Math.round((count / reviews.totalDocs) * 100)
        })
      }
      

      return {
        ...product,
        image: (product.image as Media | null),
        tenant: product.tenant as Tenant & { image: Media | null },
        isPurchased,
        reviewRating,
        reviewCount: reviews.totalDocs,
        ratingDistribution,
      }
    }),

  getMany: baseProcedure
    .input(z.object({
      cursor: z.number().default(1),
      limit: z.number().default(DEFAULT_LIMIT),

      category: z.string().nullable().optional(),
      minPrice: z.string().nullable().optional(),
      maxPrice: z.string().nullable().optional(),
      tags: z.array(z.string()).nullable().optional(),
      sort: z.enum(sortOptions).nullable().optional(),

      tenantSlug: z.string().nullable().optional(),
    }))

    .query(async ({ ctx, input }) => {

      const where: Where = {} as Where

      // { Default sort, to do later
      let sort: Sort = '-createdAt'

      if (input.sort) {
        sort = input.sort
      }
      // }

      if (input.minPrice) {
        where['price'] = {
          greater_than_equal: input.minPrice,
        }
      }

      if (input.maxPrice) {
        if (where['price']) {
          (where['price'] as any).less_than_equal = input.maxPrice
        } else {
          where['price'] = {
            less_than_equal: input.maxPrice,
          }
        }
      }

      if (input.category) {
        const categoriesData = await ctx.payload.find({
          collection: 'categories',
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            }
          }
        })

        if (input.tenantSlug) {
          where['tenant.slug'] = {
            equals: input.tenantSlug,
          }
        }

        const formattedData: CustomCategory[] = categoriesData.docs.map((category: Category) => ({
          ...category,
          subcategories: (category.subcategories?.docs ?? []).map((subcategory) => ({
            ...(subcategory as Category),
            subcategories: undefined
          })),
        }))

        if (!formattedData.length) return []

        const subcategories = []
        const parentCategory = formattedData[0]

        if (parentCategory) {
          subcategories.push(...parentCategory.subcategories.map((subcategory) => subcategory.slug))
          where['category.slug'] = {
            in: [parentCategory.slug, ...subcategories]
          }
        }
      }

      if (input.tags && input.tags.length > 0) {
        where['tags.name'] = {
          in: input.tags,
        }
      }

      const data = await ctx.payload.find({
        collection: 'products',
        depth: 2,
        where,
        sort,
        limit: input.limit,
        page: input.cursor,
      })

      const dataWithSummarizeReviews = await Promise.all(
        data.docs.map(async (doc) => {
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
        ...data,
        docs: dataWithSummarizeReviews.map((doc) => ({
          ...doc,
          imageUrl: (doc.image as Media | null),
          tenant: doc.tenant as Tenant & { image: Media | null }
        }))
      }
    })
})
