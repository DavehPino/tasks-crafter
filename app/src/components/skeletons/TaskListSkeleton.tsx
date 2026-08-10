import { motion } from "motion/react"

export const TaskListSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: i * 0.1 }}
        className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card"
      >
        {/* Checkbox */}
        <div className="h-4 w-4 bg-muted rounded-sm animate-pulse" />

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        </div>

        {/* Badge */}
        <div className="h-5 bg-muted rounded-full w-16 animate-pulse" />

        {/* Actions */}
        <div className="flex gap-1">
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
        </div>
      </motion.div>
    ))}
  </div>
)
