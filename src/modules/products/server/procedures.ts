import { Category, Category as CategoryType, Media } from "@/payload-types"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { CustomCategory } from "@/types"
import { Sort, Where } from "payload"
import { z } from "zod"
import {  sortOptions } from "@/hooks/use-product-filters-server"
import { DEFAULT_LIMIT } from "@/constants"

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(z.object({
      cursor: z.number().default(1),
      limit: z.number().default(DEFAULT_LIMIT),

      category: z.string().nullable().optional(),
      minPrice: z.string().nullable().optional(),
      maxPrice: z.string().nullable().optional(),
      tags: z.array(z.string()).nullable().optional(),
      sort: z.enum(sortOptions).nullable().optional(),
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
        depth: 1,
        where,
        sort,
        limit: input.limit,
        page: input.cursor,
      })
      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          imageUrl: (doc.image as Media | null),
          // authorImageUrl: doc.author.imageUrl,
        }))
      }
    })
})
