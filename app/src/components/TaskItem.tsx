import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Check, Pencil, Trash2, X, Save, Shield } from "lucide-react"
import type { Task } from "../schemas/task"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Props {
  task: Task;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onComplete: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  showProductInfo?: boolean;
}

export function TaskItem({
  task,
  isSelected,
  onToggleSelect,
  onComplete,
  onUpdate,
  onDelete,
  showProductInfo = false,
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.title)

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = editValue.trim()
    if (!trimmed || trimmed === task.title) {
      setIsEditing(false)
      setEditValue(task.title)
      return
    }
    onUpdate(task.id, trimmed)
    setIsEditing(false)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false)
      setEditValue(task.title)
    }
  }

  const isCompleted = task.status === "completed"
  const isMandatory = task.isMandatory === true

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors",
        isCompleted && "bg-muted/30 opacity-70",
        isMandatory && !isCompleted && "border-l-2 border-l-yellow-500"
      )}
    >
      {/* Checkbox */}
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelect(task.id)}
        className="shrink-0"
      />

      {/* Mandatory Indicator */}
      {isMandatory && (
        <Shield className={cn(
          "h-4 w-4 shrink-0",
          isCompleted ? "text-green-500" : "text-yellow-500"
        )} />
      )}

      {/* Task Content */}
      <div className={cn("flex-1 min-w-0", showProductInfo && "max-w-md")}>
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.form
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleEditSubmit}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                autoFocus
                className="flex-1 h-8 px-2 text-sm border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button type="submit" size="icon" variant="ghost" className="h-8 w-8">
                <Save className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => {
                  setIsEditing(false)
                  setEditValue(task.title)
                }}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </motion.form>
          ) : (
            <motion.span
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "text-sm block truncate",
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      {showProductInfo && task.productId && (
        <Badge variant="outline" className="shrink-0 text-[10px]">
          #{task.productId}
        </Badge>
      )}

      {/* Status Badge */}
      {showProductInfo && (
        <Badge
          variant={isCompleted ? "success" : "secondary"}
          className="shrink-0"
        >
          {isCompleted ? "Done" : "Pending"}
        </Badge>
      )}

      {/* Actions */}
      {!isCompleted && !isEditing && (
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onComplete(task.id)}
            aria-label="Mark as completed"
          >
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          {!showProductInfo && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
              aria-label="Edit task"
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      )}

      {/* Delete Button */}
      {!isMandatory && (!showProductInfo || isCompleted) && (
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
        </Button>
      )}
    </motion.li>
  )
}
