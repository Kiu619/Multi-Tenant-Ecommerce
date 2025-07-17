import { Category } from "@/payload-types"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { CustomCategory } from "@/types"

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {

    const data = await ctx.payload.find({
      collection: 'categories',
      depth: 1,
      pagination: false,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name"
    })


    const formattedData: CustomCategory[] = data.docs.map((category) => ({
      ...category,
      subcategories: (category.subcategories?.docs ?? []).map((subcategory) => ({
        ...(subcategory as Category),
        subcategories: undefined
      })),
    }))
    return formattedData
  })
})