import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTasks, createTask, updateTask, completeTask, deleteTask } from './api/tasks'
import { TaskCreator } from './components/TaskCreator'
import { TaskList } from './components/TaskList'

export default function App() {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tasks'] })

  const createMutation = useMutation({
    mutationFn: (title: string) => createTask({ title }),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => updateTask(id, { title }),
    onSuccess: invalidate,
  })

  const completeMutation = useMutation({
    mutationFn: (id: string) => completeTask(id),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: invalidate,
  })

  const handleToggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleDeleteSelected = async () => {
    await Promise.all([...selected].map((id) => deleteTask(id)))
    setSelected(new Set())
    invalidate()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Session Tasks</h1>
          {selected.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Delete selected ({selected.size})
            </button>
          )}
        </div>

        <div className="mb-6">
          <TaskCreator
            onAdd={(title) => createMutation.mutate(title)}
            isLoading={createMutation.isPending}
          />
        </div>

        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          isError={isError}
          selected={selected}
          onToggleSelect={handleToggleSelect}
          onComplete={(id) => completeMutation.mutate(id)}
          onUpdate={(id, title) => updateMutation.mutate({ id, title })}
          onDelete={(id) => deleteMutation.mutate(id)}
        />

        {tasks.length > 0 && (
          <p className="text-xs text-gray-400 mt-4 text-right">
            {tasks.filter((t) => t.status === 'completed').length} / {tasks.length} completed
          </p>
        )}
      </div>
    </div>
  )
}
