import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../schemas/task';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export interface PaginatedResponse<T> {
  tasks: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error?.message ?? 'Request failed');
  }
  if (res.status === 204) return undefined as T;
  return res.json();
};

export const fetchTasks = (page: number = 1): Promise<PaginatedResponse<Task>> =>
  request<PaginatedResponse<Task>>(`/tasks?page=${page}&limit=5`);

export const createTask = (dto: CreateTaskDTO): Promise<Task> =>
  request<Task>('/tasks', { method: 'POST', body: JSON.stringify(dto) });

export const updateTask = (id: string, dto: UpdateTaskDTO): Promise<Task> =>
  request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(dto) });

export const completeTask = (id: string): Promise<Task> =>
  request<Task>(`/tasks/${id}/complete`, { method: 'PATCH' });

export const deleteTask = (id: string): Promise<void> =>
  request<void>(`/tasks/${id}`, { method: 'DELETE' });
