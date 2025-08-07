import { DEFAULT_LIMIT } from "@/constants"
import { Media, Tenant } from "@/payload-types"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const libraryRouter = createTRPCRouter({
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

      return {
        ...productsData
      }
    })
})
