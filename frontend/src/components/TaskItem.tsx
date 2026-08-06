import { useState } from "react";
import type { Task } from "../schemas/task";

interface Props {
  task: Task;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onComplete: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({
  task,
  isSelected,
  onToggleSelect,
  onComplete,
  onUpdate,
  onDelete,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === task.title) {
      setIsEditing(false);
      setEditValue(task.title);
      return;
    }
    onUpdate(task.id, trimmed);
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(task.title);
    }
  };

  const isCompleted = task.status === "completed";

  return (
    <li className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelect(task.id)}
        className="w-4 h-4 accent-[#FF9A56] cursor-pointer shrink-0"
      />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={handleEditSubmit}
              autoFocus
              className="w-full border border-[#FF9A56] rounded px-2 py-0.5 text-sm focus-terrific"
            />
          </form>
        ) : (
          <span
            className={`text-sm block truncate ${isCompleted ? "line-through text-gray-400" : "text-gray-800"}`}
          >
            {task.title}
          </span>
        )}
      </div>

      {!isCompleted && !isEditing && (
        <>
          <button
            onClick={() => onComplete(task.id)}
            className="text-gray-400 hover:text-[#FF9A56] transition-colors text-sm shrink-0"
            aria-label="Mark as completed"
          >
            ✓
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-[#FF6B9D] transition-colors text-sm shrink-0"
            aria-label="Edit task"
          >
            ✎
          </button>
        </>
      )}

      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-500 transition-colors text-sm shrink-0"
        aria-label="Delete task"
      >
        ❌
      </button>
    </li>
  );
}
