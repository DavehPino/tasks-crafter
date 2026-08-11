import { redis } from '../lib/redis.js';
import type { Task } from '../models/task.js';

const KEY = 'tasks';

export const getAll = async (): Promise<Task[]> => {
  const data = await redis.hgetall<Record<string, string>>(KEY);
  if (!data || Object.keys(data).length === 0) return [];
  return Object.values(data).map((v) => JSON.parse(v) as Task);
};

export const getById = async (id: string): Promise<Task | undefined> => {
  const raw = await redis.hget<string>(KEY, id);
  if (!raw) return undefined;
  return JSON.parse(raw) as Task;
};

export const insert = async (title: string, productId?: number, category?: string, isMandatory?: boolean): Promise<Task> => {
  const now = new Date().toISOString();
  const task: Task = {
    id: crypto.randomUUID(),
    title,
    status: 'pending',
    productId,
    category,
    isMandatory,
    createdAt: now,
    updatedAt: now,
  };
  await redis.hset(KEY, { [task.id]: JSON.stringify(task) });
  return task;
};

export const insertMany = async (tasks: Array<{ title: string; productId: number; category: string }>): Promise<Task[]> => {
  const entries: Record<string, string> = {};
  const result: Task[] = [];

  for (const t of tasks) {
    const now = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(),
      title: t.title,
      status: 'pending',
      productId: t.productId,
      category: t.category,
      createdAt: now,
      updatedAt: now,
    };
    entries[task.id] = JSON.stringify(task);
    result.push(task);
  }

  await redis.hset(KEY, entries);
  return result;
};

export const insertMandatory = async (tasks: Array<{ id: string; title: string; description: string }>): Promise<Task[]> => {
  const entries: Record<string, string> = {};
  const result: Task[] = [];

  for (const t of tasks) {
    const now = new Date().toISOString();
    const task: Task = {
      id: t.id,
      title: t.title,
      status: 'pending',
      isMandatory: true,
      createdAt: now,
      updatedAt: now,
    };
    entries[task.id] = JSON.stringify(task);
    result.push(task);
  }

  await redis.hset(KEY, entries);
  return result;
};

export const update = async (id: string, title: string): Promise<Task | undefined> => {
  const raw = await redis.hget<string>(KEY, id);
  if (!raw) return undefined;
  const task = JSON.parse(raw) as Task;
  const updated: Task = { ...task, title, updatedAt: new Date().toISOString() };
  await redis.hset(KEY, { [id]: JSON.stringify(updated) });
  return updated;
};

export const complete = async (id: string): Promise<Task | undefined> => {
  const raw = await redis.hget<string>(KEY, id);
  if (!raw) return undefined;
  const task = JSON.parse(raw) as Task;
  const updated: Task = { ...task, status: 'completed', updatedAt: new Date().toISOString() };
  await redis.hset(KEY, { [id]: JSON.stringify(updated) });
  return updated;
};

export const remove = async (id: string): Promise<boolean> => {
  const result = await redis.hdel(KEY, id);
  return result > 0;
};
