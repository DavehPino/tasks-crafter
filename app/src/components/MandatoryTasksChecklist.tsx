import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { initializeMandatoryTasks, getMandatoryStatus, completeTask } from '@/api/tasks'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AlertTriangle, CheckCircle2, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  onStatusChange?: (canGoLive: boolean) => void
}

export const MandatoryTasksChecklist = ({ onStatusChange }: Props) => {
  const queryClient = useQueryClient()

  // Initialize mandatory tasks on mount
  const initMutation = useMutation({
    mutationFn: initializeMandatoryTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mandatoryStatus'] })
    },
  })

  // Get mandatory status
  const { data: status, isLoading } = useQuery({
    queryKey: ['mandatoryStatus'],
    queryFn: getMandatoryStatus,
    refetchInterval: 1000, // Refetch every second to stay updated
  })

  // Complete task mutation
  const completeMutation = useMutation({
    mutationFn: (taskId: string) => completeTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mandatoryStatus'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  // Initialize on mount
  useEffect(() => {
    initMutation.mutate()
  }, [])

  // Notify parent of status change
  useEffect(() => {
    if (status) {
      onStatusChange?.(status.canGoLive)
    }
  }, [status, onStatusChange])

  if (isLoading || !status) {
    return (
      <Card className="p-4 border-border/50 bg-card">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-48" />
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </div>
      </Card>
    )
  }

  const { mandatoryTasks, completed, total, allCompleted } = status

  return (
    <Card className={cn(
      "p-4 border-2 transition-colors",
      allCompleted
        ? "border-green-500 bg-green-50 dark:bg-green-950/30"
        : "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className={cn(
            "h-5 w-5",
            allCompleted ? "text-green-600" : "text-yellow-600"
          )} />
          <h3 className="text-sm font-semibold text-foreground">
            Pre-Session Checklist
          </h3>
        </div>
        <Badge variant={allCompleted ? "success" : "warning"}>
          {completed}/{total}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-4">
        Complete all mandatory tasks before going live
      </p>

      {/* Tasks List */}
      <div className="space-y-2">
        <AnimatePresence>
          {mandatoryTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                task.status === 'completed'
                  ? "bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                  : "bg-background border-border/50 hover:border-yellow-300"
              )}
            >
              <Checkbox
                checked={task.status === 'completed'}
                onCheckedChange={() => {
                  if (task.status !== 'completed') {
                    completeMutation.mutate(task.id)
                  }
                }}
                disabled={task.status === 'completed'}
                className={cn(
                  "mt-0.5",
                  task.status === 'completed' && "bg-green-600 border-green-600"
                )}
              />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium",
                  task.status === 'completed' && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {task.description}
                </p>
              </div>
              {task.status === 'completed' && (
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Warning if not all complete */}
      {!allCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center gap-2 text-xs text-yellow-700 dark:text-yellow-400"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Complete all tasks to enable "Go Live" button</span>
        </motion.div>
      )}
    </Card>
  )
}
