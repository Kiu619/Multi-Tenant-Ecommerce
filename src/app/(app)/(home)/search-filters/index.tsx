import { Categories } from "./categories"
import { SearchInput } from "./search-input"
import { CustomCategory } from "@/types"

interface SearchFiltersProps {
  data: CustomCategory[]
}

export const SearchFilters = ({ data }: SearchFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 w-full px-4 lg:px-12 py-8 border-b">
      <SearchInput disabled={false} data={data} />
      <Categories data={data} />
    </div>
  )
}
