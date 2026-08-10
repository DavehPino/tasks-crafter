import { motion } from "motion/react"
import { Radio, CheckCircle2, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Props {
  totalProducts: number;
  readyProducts: number;
  totalTasks: number;
  completedTasks: number;
  isSessionReady: boolean;
}

export const SessionMetrics = ({
  totalProducts,
  readyProducts,
  totalTasks,
  completedTasks,
  isSessionReady,
}: Props) => {
  const tasksPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const productsPercentage = totalProducts > 0 ? Math.round((readyProducts / totalProducts) * 100) : 0

  return (
    <Card className="p-6 mb-8 border-border/50 bg-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Products Ready — Hero Metric */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Products Ready
            </span>
          </div>

          <div className="flex items-end gap-3">
            <motion.span
              key={readyProducts}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold text-foreground font-mono leading-none tabular-nums"
            >
              {readyProducts}
            </motion.span>
            <span className="text-2xl text-muted-foreground mb-1">
              /{totalProducts}
            </span>
          </div>

          <Progress
            value={productsPercentage}
            className="h-2"
            indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-500"
          />

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            {productsPercentage}% READY
          </div>
        </motion.div>

        {/* Tasks Completion — Hero Metric */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tasks Completed
            </span>
          </div>

          <div className="flex items-end gap-3">
            <motion.span
              key={completedTasks}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "text-5xl font-bold font-mono leading-none tabular-nums",
                tasksPercentage === 100 ? "text-green-500" : "text-foreground"
              )}
            >
              {completedTasks}
            </motion.span>
            <span className="text-2xl text-muted-foreground mb-1">
              /{totalTasks}
            </span>
          </div>

          <Progress
            value={tasksPercentage}
            className="h-2"
            indicatorClassName={cn(
              "transition-all duration-500",
              tasksPercentage === 100
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-primary to-terrific-pink"
            )}
          />

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            {tasksPercentage === 100 ? (
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            ) : (
              <AlertCircle className="h-3 w-3 text-yellow-500" />
            )}
            {tasksPercentage}% COMPLETE
          </div>
        </motion.div>
      </div>

      {/* Go Live Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 pt-6 border-t border-border/50"
      >
        <Button
          disabled={!isSessionReady}
          size="lg"
          className={cn(
            "w-full h-12 text-sm font-semibold transition-all",
            isSessionReady
              ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/25"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {isSessionReady ? (
            <>
              <Radio className="h-4 w-4 mr-2 animate-pulse" />
              START LIVE SESSION
            </>
          ) : (
            "Complete all tasks to start"
          )}
        </Button>
      </motion.div>
    </Card>
  )
}
