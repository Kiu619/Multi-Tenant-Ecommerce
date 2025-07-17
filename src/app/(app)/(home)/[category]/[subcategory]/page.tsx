import { caller } from "@/trpc/server"

interface Props {
  params: Promise<{ category: string, subcategory: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { category, subcategory } = await params
  // const categoryData = await caller.categories.getOne(category)
  return <div>{category} {subcategory}</div>
}