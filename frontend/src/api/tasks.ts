import axios from 'axios';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../schemas/task';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api',
});

export const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await api.get<Task[]>('/tasks');
  return data;
};

export const createTask = async (dto: CreateTaskDTO): Promise<Task> => {
  const { data } = await api.post<Task>('/tasks', dto);
  return data;
};

export const updateTask = async (id: string, dto: UpdateTaskDTO): Promise<Task> => {
  const { data } = await api.put<Task>(`/tasks/${id}`, dto);
  return data;
};

export const completeTask = async (id: string): Promise<Task> => {
  const { data } = await api.patch<Task>(`/tasks/${id}/complete`);
  return data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
