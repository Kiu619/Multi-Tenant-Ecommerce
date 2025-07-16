"use client"

import { ListFilterIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CategoriesSidebar } from "./categories-sidebar"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CustomCategory } from "@/types"
interface Props {
  disabled?: boolean
  data: CustomCategory[]
}

export const SearchInput = ({ disabled, data }: Props) => {
  const [isCategoriesSidebarOpen, setIsCategoriesSidebarOpen] = useState(false)

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative w-full">
        <CategoriesSidebar isOpen={isCategoriesSidebarOpen} onOpenChange={setIsCategoriesSidebarOpen} data={data} />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 size-4" />
        <Input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 pl-10"
          disabled={disabled}
        />
      </div>

      <Button
        variant='elevated'
        className="size-12 shrink-0 flex lg:hidden"
        onClick={() => setIsCategoriesSidebarOpen(true)}
      >
        <ListFilterIcon className="size-4" />
      </Button>
    </div>
  )
}
