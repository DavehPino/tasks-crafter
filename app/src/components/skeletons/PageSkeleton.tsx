import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
import { ProductCardSkeleton } from "./ProductCardSkeleton"
import { TaskListSkeleton } from "./TaskListSkeleton"

export const PageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 border-b border-border/50 pb-6"
      >
        <div className="h-10 bg-muted rounded w-48 animate-pulse mb-2" />
        <div className="h-4 bg-muted rounded w-96 animate-pulse" />
      </motion.div>

      {/* Metrics Skeleton */}
      <Card className="p-6 mb-8 border-border/50 bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <div className="h-3 bg-muted rounded w-24 animate-pulse" />
              <div className="flex items-end gap-3">
                <div className="h-12 bg-muted rounded w-16 animate-pulse" />
                <div className="h-6 bg-muted rounded w-8 animate-pulse" />
              </div>
              <div className="h-2 bg-muted rounded-full w-full animate-pulse" />
              <div className="h-3 bg-muted rounded w-20 animate-pulse" />
            </motion.div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="h-12 bg-muted rounded w-full animate-pulse" />
        </div>
      </Card>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="p-6 border-border/50 bg-card">
            {/* Products Header */}
            <div className="flex items-baseline justify-between border-b border-border/50 pb-3 mb-4">
              <div className="space-y-2">
                <div className="h-5 bg-muted rounded w-24 animate-pulse" />
                <div className="h-3 bg-muted rounded w-40 animate-pulse" />
              </div>
              <div className="h-4 bg-muted rounded w-12 animate-pulse" />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <ProductCardSkeleton key={i} index={i} />
              ))}
            </div>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="bg-card rounded-md border border-border/50 p-5 h-fit sticky top-6">
          <div className="h-3 bg-muted rounded w-12 animate-pulse mb-4 pb-3 border-b border-border/50" />
          <div className="space-y-4 text-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className={i === 3 ? "border-t border-border/50 pt-4" : ""}>
                <div className="h-3 bg-muted rounded w-16 animate-pulse mx-auto mb-2" />
                <div className="h-8 bg-muted rounded w-12 animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline & Tasks Skeleton */}
      <div className="mt-8 space-y-6">
        <Card className="p-6 border-border/50 bg-card">
          <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
            <div className="h-4 bg-muted rounded w-40 animate-pulse" />
            <div className="h-3 bg-muted rounded w-12 animate-pulse" />
          </div>
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex-shrink-0 px-4 py-3 rounded-md border-2 border-border/50 bg-card"
              >
                <div className="h-3 bg-muted rounded w-24 animate-pulse mb-2" />
                <div className="flex items-center justify-between gap-2">
                  <div className="h-5 bg-muted rounded w-5 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-8 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border/50 bg-card">
          <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
            <div className="h-4 bg-muted rounded w-36 animate-pulse" />
            <div className="h-3 bg-muted rounded w-12 animate-pulse" />
          </div>
          <TaskListSkeleton />
        </Card>
      </div>
    </div>
  </div>
)
