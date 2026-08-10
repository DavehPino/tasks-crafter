import { motion, AnimatePresence } from 'motion/react'
import type { Task } from '../schemas/task'
import type { Product } from '../schemas/product'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductWithTasks {
  product: Product
  tasks: Task[]
}

interface Props {
  productsWithTasks: ProductWithTasks[]
  expandedProductId?: number
  onToggleExpand: (productId: number) => void
}

export const ProductTimeline = ({
  productsWithTasks,
  expandedProductId,
  onToggleExpand,
}: Props) => {
  if (productsWithTasks.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Preparation Timeline
        </h3>
        <Badge variant="secondary" className="font-mono">
          {productsWithTasks.length} item{productsWithTasks.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Horizontal Timeline — SIGNATURE */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {productsWithTasks.map(({ product, tasks }, index) => {
          const completed = tasks.filter(t => t.status === 'completed').length
          const total = tasks.length
          const allDone = completed === total && total > 0
          const isExpanded = expandedProductId === product.id

          return (
            <motion.button
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleExpand(product.id)}
              className={cn(
                "flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all cursor-pointer",
                isExpanded
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : allDone
                  ? "border-green-400 bg-green-50 dark:bg-green-950/30"
                  : "border-border/50 bg-card hover:border-primary/30 hover:shadow-sm"
              )}
            >
              <div className="text-xs font-semibold text-foreground line-clamp-2 mb-2 w-32">
                {product.title.substring(0, 28)}
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {allDone ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : completed > 0 ? (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <span className={cn(
                  "text-sm font-bold font-mono",
                  allDone ? "text-green-600 dark:text-green-400" : "text-foreground"
                )}>
                  {completed}/{total}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expandedProductId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-border/50 pt-4">
              {productsWithTasks
                .filter(({ product }) => product.id === expandedProductId)
                .map(({ product, tasks }) => (
                  <div key={product.id}>
                    <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="text-lg">
                        {tasks.every(t => t.status === 'completed') ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : tasks.some(t => t.status === 'completed') ? (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </span>
                      {product.title}
                    </h4>
                    <ul className="space-y-2">
                      {tasks.map((task, i) => (
                        <motion.li
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn(
                            "text-xs py-1.5 pl-4 border-l-2",
                            task.status === 'completed'
                              ? "line-through text-muted-foreground border-green-400"
                              : "text-foreground border-border/50"
                          )}
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="h-3 w-3 inline mr-1 text-green-500" />
                          ) : (
                            <Circle className="h-3 w-3 inline mr-1 text-muted-foreground" />
                          )}
                          {task.title}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
