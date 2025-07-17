
interface Props {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  // const categoryData = await caller.categories.getOne(category)
  return <div>{category}</div>
}