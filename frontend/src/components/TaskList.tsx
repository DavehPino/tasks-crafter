import type { Task } from '../schemas/task'
import { TaskItem } from './TaskItem'

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
}

export function TaskList({ tasks, isLoading, isError, selected, allSelected, onToggleSelect, onToggleAll, onComplete, onUpdate, onDelete }: Props) {
  if (isLoading) {
    return <p className="text-sm text-gray-400 text-center py-6">Loading tasks...</p>
  }

  if (isError) {
    return <p className="text-sm text-red-500 text-center py-6">Failed to load tasks. Is the server running?</p>
  }

  if (tasks.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">No tasks yet. Add one above.</p>
  }

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
      <ul className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isSelected={selected.has(task.id)}
            onToggleSelect={onToggleSelect}
            onComplete={onComplete}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </>
  )
}
