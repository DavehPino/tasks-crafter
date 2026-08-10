import { lazy, Suspense, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from "./api/tasks"
import { TaskCreator } from "./components/TaskCreator"
import { TaskList } from "./components/TaskList"
import { PageSkeleton } from "./components/skeletons/PageSkeleton"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

// Lazy load pages for code splitting
const ProductsPage = lazy(() => import("./pages/ProductsPage").then(m => ({ default: m.ProductsPage })))
const SessionPrepPage = lazy(() => import("./pages/SessionPrepPage").then(m => ({ default: m.SessionPrepPage })))

type Page = "tasks" | "products" | "session"

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("session")
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold gradient-terrific-text">
              Tasks Crafter
            </h1>
            <div className="flex gap-1">
              <Button
                variant={currentPage === "session" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage("session")}
                className={currentPage === "session" ? "bg-primary text-primary-foreground" : ""}
              >
                Session Prep
              </Button>
              <Button
                variant={currentPage === "tasks" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage("tasks")}
                className={currentPage === "tasks" ? "bg-primary text-primary-foreground" : ""}
              >
                Tasks
              </Button>
              <Button
                variant={currentPage === "products" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage("products")}
                className={currentPage === "products" ? "bg-primary text-primary-foreground" : ""}
              >
                Products
              </Button>
            </div>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-terrific-orange" />
            ) : (
              <Moon className="h-4 w-4 text-terrific-pink" />
            )}
          </Button>
        </div>
      </nav>

      <main className="max-w-full">
        <Suspense fallback={<PageSkeleton />}>
          {currentPage === "session" && <SessionPrepPage />}
          {currentPage === "tasks" && (
            <div className="max-w-6xl mx-auto px-4 py-6">
              <TasksView />
            </div>
          )}
          {currentPage === "products" && (
            <div className="max-w-6xl mx-auto px-4 py-6">
              <ProductsPage />
            </div>
          )}
        </Suspense>
      </main>
    </div>
  )
}

function TasksView() {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", page],
    queryFn: () => fetchTasks(page),
  })

  const tasks = response?.tasks ?? []
  const pagination = response?.pagination

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["tasks"] })

  const createMutation = useMutation({
    mutationFn: (title: string) => createTask({ title }),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      updateTask(id, { title }),
    onSuccess: invalidate,
  })

  const completeMutation = useMutation({
    mutationFn: (id: string) => completeTask(id),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: (_data, id) => {
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      invalidate()
    },
  })

  const handleToggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleToggleAll = () => {
    setSelected((prev) => {
      const allSelected = tasks.every((t) => prev.has(t.id))
      if (allSelected) return new Set()
      return new Set(tasks.map((t) => t.id))
    })
  }

  const handleDeleteSelected = async () => {
    await Promise.all([...selected].map((id) => deleteTask(id)))
    setSelected(new Set())
    invalidate()
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-card rounded-xl border border-border/50 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-terrific-text">
          Session Tasks
        </h2>
        {selected.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
          >
            Delete selected ({selected.size})
          </Button>
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
        allSelected={tasks.length > 0 && tasks.every((t) => selected.has(t.id))}
        onToggleSelect={handleToggleSelect}
        onToggleAll={handleToggleAll}
        onComplete={(id) => completeMutation.mutate(id)}
        onUpdate={(id, title) => updateMutation.mutate({ id, title })}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <div className="mt-6 flex items-center justify-between text-xs">
        <p className="text-muted-foreground">
          {pagination ? `${pagination.page} / ${pagination.totalPages}` : "—"}
        </p>
        {pagination && pagination.totalPages > 1 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
            >
              Next →
            </Button>
          </div>
        )}
        {tasks.length > 0 && (
          <p className="text-muted-foreground">
            {tasks.filter((t) => t.status === "completed").length} /{" "}
            {tasks.length} on page
          </p>
        )}
      </div>
    </div>
  )
}
