import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ReactNode, Suspense } from "react"
import { Footer } from "./footer"
import { NavbarWrapper } from "./navbar-wrapper"
import { SearchFilters, SearchFiltersLoading } from "./search-filters"
interface Props {
  children: ReactNode
}

export default function HomeLayout({ children }: Props) {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions())
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarWrapper />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFiltersLoading />}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      <main className="flex-1 bg-[#F4F4F0]">
        {children}
      </main>
      <Footer />
    </div>
  )
}
