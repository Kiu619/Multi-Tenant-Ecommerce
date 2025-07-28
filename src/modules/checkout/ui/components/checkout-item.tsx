import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/utils"

interface Props {
  isLast?: boolean
  imageUrl?: string | null
  name: string
  productUrl: string
  tenantUrl: string
  tenantName: string
  price: number
  onRemove: () => void
}

export const CheckoutItem = ({ isLast, imageUrl, name, productUrl, tenantUrl, tenantName, price, onRemove }: Props) => {
  return (
    <div className={cn(
      "grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4 border-b",
      isLast && "border-b-0"
    )}>
      <div className="overflow-hidden border-r">
        <div className="relative aspect-square h-full">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="object-cover"
          />
        </div>
      </div>

      <div className="py-4 flex flex-col justify-between">
        <div className="">
          <Link href={productUrl}>
            <h4 className="font-bold underline">{name}</h4>
          </Link>
          <Link href={tenantUrl}>
            <h4 className="font-medium underline">{tenantName || "Unknown Store"}</h4>
          </Link>
        </div>
      </div>

      <div className="py-4 flex flex-col justify-between">
        <p className="font-medium">
          {formatPrice(price)}
        </p>
        <button onClick={onRemove} className="underline font-medium cursor-pointer" type="button">
          Remove
        </button>
      </div>
    </div>
  )
}