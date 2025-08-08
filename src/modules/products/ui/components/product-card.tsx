import { formatPrice, generateTenantURL } from "@/lib/utils"
import { StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  id: string
  name: string
  imageUrl: string
  tenantSlug: string
  tenantImageUrl: string
  reviewRating: number
  reviewCount: number
  price: number
}

export const ProductCard = ({
  id,
  name,
  imageUrl,
  tenantSlug,
  tenantImageUrl,
  reviewRating,
  reviewCount,
  price
}: ProductCardProps) => {
  const router = useRouter()

  const handleTenantClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    router.push(generateTenantURL(tenantSlug))
  }

  return (
    <Link href={`${generateTenantURL(tenantSlug)}/products/${id}`}>
      <div className="flex flex-col border rounded-md bg-white overflow-hidden h-full hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300">
        <div className="relative aspect-square">
          <Image src={imageUrl || "/placeholder.png"} alt={name} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </div>

        <div className="p-4 border-y flex flex-col gap-3 flex-1">
          <h2 className="text-lg font-medium line-clamp-4">{name}</h2>
          <div className="flex items-center gap-2 hover:text-pink-500" onClick={handleTenantClick}>
            {tenantImageUrl && (
              <Image src={tenantImageUrl} alt={tenantSlug} width={16} height={16} className="rounded-full border shrink-0 size-[16px]" />
            )}
            <p className="text-sm underline font-medium">{tenantSlug}</p>
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <StarIcon className="w-4 h-4 fill-black stroke-black" />
              <p className="text-sm text-gray-500">{reviewRating} ({reviewCount})</p>
            </div>
          )}

        </div>
        <div className="p-4">
          <div className="relative px-2 py-1 border bg-pink-400 w-fit">
            <p className="text-sm font-medium">
              {formatPrice(price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export const ProductCardSkeleton = () => {
  return (
    <div className="w-full aspect-3/4 bg-neutral-200 animate-pulse rounded-lg"></div>
  )
}
