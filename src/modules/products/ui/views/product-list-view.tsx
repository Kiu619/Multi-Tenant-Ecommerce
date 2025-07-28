
import { Suspense } from "react"
import { ProductSort } from "../components/product-sort"
import { ProductFilters } from "../components/product-filters"
import { ProductList, ProductListSkeleton } from "../components/product-list"

interface Props {
  category?: string
  tenantSlug?: string
  narrowView?: boolean
}

export const ProductListView = ({ category, tenantSlug, narrowView }: Props) => {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-12 py-8">

      <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg-y-0 justify-between">
        <p className="text-2xl font-medium">Curated for you</p>
        <ProductSort />
      </div>

      <div className="grid gird-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
        <div className="lg:col-span-2 xl:col-span-2">
          <div className="border p-2">
            <ProductFilters />
          </div>
        </div>

        <div className="lg:col-span-4 xl:col-span-6">
          <Suspense fallback={<ProductListSkeleton narrowView={narrowView} />}>
            <ProductList category={category} tenantSlug={tenantSlug} narrowView={narrowView} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}