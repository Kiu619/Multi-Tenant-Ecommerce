import { Checkbox } from "@/components/ui/checkbox"
import { DEFAULT_LIMIT } from "@/constants"
import { Tag } from "@/payload-types"
import { useTRPC } from "@/trpc/client"
import { useInfiniteQuery } from "@tanstack/react-query"
import { LoaderIcon } from "lucide-react"

interface TagsFilterProps {
  value: string[] | null
  onChange: (value: string[]) => void
}

export const TagsFilter = ({ value, onChange }: TagsFilterProps) => {

  const trcp = useTRPC()
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery(trcp.tags.getMany.infiniteQueryOptions(
    {
      limit: DEFAULT_LIMIT
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.docs.length > 0 ? lastPage.nextPage : undefined
      }
    }
  ))

  const handleChange = (tag: string) => {
    if (value?.includes(tag)) {
      onChange(value.filter((t) => t !== tag) || [])
    } else {
      onChange([...(value || []), tag])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((page) => (
          page.docs.map((tag: Tag) => (
            <div className="flex items-center justify-between cursor-pointer" key={tag.id}>
              <p className="font-medium">{tag.name}</p>
              <Checkbox
                checked={value?.includes(tag.name)}
                onCheckedChange={() => handleChange(tag.name)}
              />
            </div>
          ))
        ))
      )}

      {hasNextPage && (
        <button className="underline font-medium justify-start text-start disabled:opacity-50 disabled:cursor-not-allowed" type="button" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Load more
        </button>
      )}
    </div>
  )
}