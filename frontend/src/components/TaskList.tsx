import type { Task } from '../schemas/task'
import { TaskItem } from './TaskItem'

interface Props {
  tasks: Task[]
  isLoading: boolean
  isError: boolean
  selected: Set<string>
  onToggleSelect: (id: string) => void
  onComplete: (id: string) => void
  onUpdate: (id: string, title: string) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, isLoading, isError, selected, onToggleSelect, onComplete, onUpdate, onDelete }: Props) {
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
  )
}
