import type { Task } from '../schemas/task'
import { TaskItem } from './TaskItem'
import { Shield } from 'lucide-react'

interface Props {
  tasks: Task[]
  isLoading: boolean
  isError: boolean
  selected: Set<string>
  allSelected: boolean
  onToggleSelect: (id: string) => void
  onToggleAll: () => void
  onComplete: (id: string) => void
  onUpdate: (id: string, title: string) => void
  onDelete: (id: string) => void
  showProductInfo?: boolean
}

export function TaskList({ tasks, isLoading, isError, selected, allSelected, onToggleSelect, onToggleAll, onComplete, onUpdate, onDelete, showProductInfo = false }: Props) {
  if (isLoading) {
    return <p className="text-sm text-gray-400 text-center py-6">Loading tasks...</p>
  }

  if (isError) {
    return <p className="text-sm text-red-500 text-center py-6">Failed to load tasks. Is the server running?</p>
  }

  if (tasks.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">No tasks yet. Add one above.</p>
  }

  const mandatoryTasks = tasks.filter(t => t.isMandatory)
  const regularTasks = tasks.filter(t => !t.isMandatory)

  return (
    <>
      <div className="flex items-center gap-3 py-2 border-b border-gray-200">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAll}
          className="w-4 h-4 accent-terrific-orange cursor-pointer shrink-0"
        />
        <span className="text-xs text-gray-500">Select all</span>
      </div>

      {/* Mandatory Tasks Section */}
      {mandatoryTasks.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-2 py-2 text-xs text-yellow-600 font-medium">
            <Shield className="h-3 w-3" />
            <span>Pre-Session Checklist</span>
          </div>
          <ul className="divide-y divide-gray-100">
            {mandatoryTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isSelected={selected.has(task.id)}
                onToggleSelect={onToggleSelect}
                onComplete={onComplete}
                onUpdate={onUpdate}
                onDelete={onDelete}
                showProductInfo={showProductInfo}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Regular Tasks Section */}
      {regularTasks.length > 0 && (
        <div className={mandatoryTasks.length > 0 ? "mt-4" : ""}>
          {showProductInfo && (
            <div className="flex items-center gap-3 py-2 border-b border-gray-200 text-xs text-gray-500 px-2">
              <div className="w-4 shrink-0" />
              <div className="flex-1">Task</div>
              <div className="w-20">Product</div>
              <div className="w-16">Status</div>
              <div className="w-8" />
            </div>
          )}
          <ul className="divide-y divide-gray-100">
            {regularTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isSelected={selected.has(task.id)}
                onToggleSelect={onToggleSelect}
                onComplete={onComplete}
                onUpdate={onUpdate}
                onDelete={onDelete}
                showProductInfo={showProductInfo}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
