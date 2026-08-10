import { Task } from '../models/task.js';

const store = new Map<string, Task>();

export const getAll = (): Task[] => Array.from(store.values());

export const getById = (id: string): Task | undefined => store.get(id);

export const insert = (title: string, productId?: number, category?: string): Task => {
  const now = new Date().toISOString();
  const task: Task = {
    id: crypto.randomUUID(),
    title,
    status: 'pending',
    productId,
    category,
    createdAt: now,
    updatedAt: now,
  };
  store.set(task.id, task);
  return task;
};

export const insertMany = (tasks: Array<{ title: string; productId: number; category: string }>): Task[] => {
  return tasks.map(t => insert(t.title, t.productId, t.category));
};

export const update = (id: string, title: string): Task | undefined => {
  const task = store.get(id);
  if (!task) return undefined;
  const updated: Task = { ...task, title, updatedAt: new Date().toISOString() };
  store.set(id, updated);
  return updated;
};

export const complete = (id: string): Task | undefined => {
  const task = store.get(id);
  if (!task) return undefined;
  const updated: Task = { ...task, status: 'completed', updatedAt: new Date().toISOString() };
  store.set(id, updated);
  return updated;
};

export const remove = (id: string): boolean => store.delete(id);
