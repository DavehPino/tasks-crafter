import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from "./api/tasks";
import { TaskCreator } from "./components/TaskCreator";
import { TaskList } from "./components/TaskList";

export default function App() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", page],
    queryFn: () => fetchTasks(page),
  });

  const tasks = response?.tasks ?? [];
  const pagination = response?.pagination;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["tasks"] });

  const createMutation = useMutation({
    mutationFn: (title: string) => createTask({ title }),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      updateTask(id, { title }),
    onSuccess: invalidate,
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => completeTask(id),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: invalidate,
  });

  const handleToggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelected((prev) => {
      const allSelected = tasks.every((t) => prev.has(t.id));
      if (allSelected) return new Set();
      return new Set(tasks.map((t) => t.id));
    });
  };

  const handleDeleteSelected = async () => {
    await Promise.all([...selected].map((id) => deleteTask(id)));
    setSelected(new Set());
    invalidate();
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border-2 border-transparent bg-linear-to-br from-white to-white p-6 relative overflow-hidden before:absolute before:inset-0 before:rounded-[10px] before:p-0.5 before:bg-linear-to-r before:from-terrific-orange before:to-terrific-pink before:-z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold gradient-terrific-text">
            Session Tasks
          </h1>
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
          allSelected={tasks.length > 0 && tasks.every((t) => selected.has(t.id))}
          onToggleSelect={handleToggleSelect}
          onToggleAll={handleToggleAll}
          onComplete={(id) => completeMutation.mutate(id)}
          onUpdate={(id, title) => updateMutation.mutate({ id, title })}
          onDelete={(id) => deleteMutation.mutate(id)}
        />

        <div className="mt-6 flex items-center justify-between text-xs">
          <p className="text-gray-400">
            {pagination ? `${pagination.page} / ${pagination.totalPages}` : "—"}
          </p>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-xs hover:border-terrific-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-xs hover:border-terrific-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
          {tasks.length > 0 && (
            <p className="text-gray-400">
              {tasks.filter((t) => t.status === "completed").length} /{" "}
              {tasks.length} on page
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
