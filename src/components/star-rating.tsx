import { StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const MAX_RATING = 5
const MIN_RATING = 0

interface StarRatingProps {
  rating: number
  className?: string
  iconClassName?: string
  text?: string
}

export const StarRating = ({ rating, className, iconClassName, text }: StarRatingProps) => {

  const safeRating = Math.max(MIN_RATING, Math.min(MAX_RATING, rating))

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: MAX_RATING }).map((_, index) => (
        <StarIcon
          key={index}
          className={cn("w-4 h-4", index < safeRating ? "fill-black" : "fill-none", iconClassName)}
        />
      ))}
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  )
}
