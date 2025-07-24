import Link from "next/link"
import { Category } from "@/modules/categories/types"

interface Props {
  category: Category
  isOpen: boolean
}

export const SubcategoryMenu = ({ category, isOpen }: Props) => {
  if (!isOpen || !category.subcategories?.length) return null

  const backgroundColor = category.color || "#F5F5F5"

  return (
    <div
      className="absolute z-50"
      style={{
        top: '100%',
        left: 0,
        backgroundColor: "transparent"
      }}
    >
      <div className="h-3 w-60 bg-transparent" />
      <div
        className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0_0_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5"
        style={{
          backgroundColor
        }}
      >
        <div className="flex flex-col gap-2">
          {category.subcategories.map((subcategory) => (
            <Link
              key={subcategory.slug}
              href={`/${category.slug}/${subcategory.slug}`}
              className="flex justify-between items-center underline font-medium w-full text-left p-4 hover:bg-black hover:text-white"
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
