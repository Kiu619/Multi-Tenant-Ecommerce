"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CategoriesGetManyOutput } from "@/modules/categories/types"
import { ListFilterIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { CategoriesSidebar } from "./categories-sidebar"
import { CategoryDropdown } from "./category-dropdown"

interface Props {
  data: CategoriesGetManyOutput
}

export const Categories = ({ data }: Props) => {
  const params = useParams()

  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const viewAllRef = useRef<HTMLDivElement>(null)

  const [visibleCount, setVisibleCount] = useState(data.length)
  const [isAnyHovered, setIsAnyHovered] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const activeCategory = params.category

  const activeCategoryIndex = data.findIndex((category) => category.slug === activeCategory)
  const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1

  useEffect(() => {
    const calculateVisibleCount = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const viewAllWidth = viewAllRef.current.offsetWidth
      const availableWidth = containerWidth - viewAllWidth

      const items = Array.from(measureRef.current.children)
      let totalWidth = 0
      let visibleItems = 0

      for (const item of items) {
        const width = item.getBoundingClientRect().width

        if (totalWidth + width > availableWidth) break

        totalWidth += width
        visibleItems++
      }

      setVisibleCount(visibleItems)
    }

    const resizeObserver = new ResizeObserver(calculateVisibleCount)
    resizeObserver.observe(containerRef.current!)

    return () => resizeObserver.disconnect()
  }, [data.length])


  return (
    <div className="relative w-full hidden lg:block">

      {/* Categories sidebar */}
      <CategoriesSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} data={data} />
      {/* Hidden div to measure the width of the categories */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex"
        style={{
          position: "fixed",
          top: -999,
          left: -999,
        }}
      >
        {data?.map((category) => (
          <div key={category.id}>
            <CategoryDropdown category={category} isActive={false} isNavigationHovered={false} />
          </div>
        ))}
      </div>

      <div
        ref={containerRef}
        className="flex flex-nowrap items-center"
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {data?.slice(0, visibleCount)?.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={category.slug === activeCategory}
              isNavigationHovered={isAnyHovered}
            // isSidebarOpen={isSidebarOpen}
            />
          </div>
        ))}

        <div className="shrink-0" ref={viewAllRef}>
          <Button
          
            className={cn(
              "h-11 px-4 bg-transparent border-transparent hover:bg-white hover:border-primary text-black",
              isActiveCategoryHidden && !isAnyHovered && "bg-white border-primary "
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            View All
            <ListFilterIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
