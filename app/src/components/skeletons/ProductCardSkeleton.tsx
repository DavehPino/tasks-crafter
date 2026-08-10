import { motion } from "motion/react"
import { Card } from "@/components/ui/card"

export const ProductCardSkeleton = ({ index = 0 }: { index?: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    <Card className="overflow-hidden border-border/50 bg-card">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-3 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full animate-pulse" />
          <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-muted rounded w-16 animate-pulse" />
          <div className="h-3 bg-muted rounded w-12 animate-pulse" />
        </div>

        {/* Button */}
        <div className="h-8 bg-muted rounded w-full animate-pulse" />
      </div>
    </Card>
  </motion.div>
)
