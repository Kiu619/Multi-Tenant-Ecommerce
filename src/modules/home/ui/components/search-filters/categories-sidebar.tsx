
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CategoriesGetManyOutput, Category } from "@/modules/categories/types"

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  data: CategoriesGetManyOutput
}

export const CategoriesSidebar = ({ isOpen, onOpenChange, data }: Props) => {
  const router = useRouter()
  
  const [parentCategories, setParentCategories] = useState<CategoriesGetManyOutput | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)

  const currentCategory = parentCategories ?? data ?? []


  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setParentCategories(null)
      setActiveCategory(null)
    }
    onOpenChange(open)
  }

  const handleCategoryClick = (category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetManyOutput)
      setActiveCategory(category)
    } else {
      if (parentCategories && activeCategory) {
        router.push(`/${activeCategory.slug}/${category.slug}`)
      } else {
        if (category.slug === 'all') {
          router.push('/')
        } else {
          router.push(`/${category.slug}`)
        }
      }

      handleOpenChange(false)
    }
  }

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null)
      setActiveCategory(null)
    } else {
      handleOpenChange(false)
    }
  }

  const backgroundColor = activeCategory?.color ?? 'white'

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="w-full max-w-md"
        style={{ backgroundColor }}
      >
        <SheetHeader>
          <SheetTitle>Categories</SheetTitle>
          <SheetDescription className="sr-only">
            Browse and filter products by categories
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              className="flex items-center w-full text-left p-4 hover:bg-black hover:text-white text-base font-medium cursor-pointer"
              onClick={handleBackClick}
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}

          {currentCategory.map((category) => (
            <button
              key={category.id}
              className="flex items-center justify-between w-full text-left p-4 hover:bg-black hover:text-white text-base font-medium cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
