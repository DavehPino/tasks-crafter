import { redis } from '../lib/redis.js';
import type { Task } from '../models/task.js';

const getKey = (sessionId: string): string => `tasks:${sessionId}`;

const safeParse = (v: string | object): Task => {
  if (typeof v === 'string') {
    return JSON.parse(v) as Task;
  }
  return v as unknown as Task;
};

export const getAll = async (sessionId: string): Promise<Task[]> => {
  const data = await redis.hgetall<Record<string, string>>(getKey(sessionId));
  if (!data || Object.keys(data).length === 0) return [];
  return Object.values(data).map(safeParse);
};

export const getById = async (sessionId: string, id: string): Promise<Task | undefined> => {
  const raw = await redis.hget<string>(getKey(sessionId), id);
  if (!raw) return undefined;
  return safeParse(raw);
};

export const insert = async (sessionId: string, title: string, productId?: number, category?: string, isMandatory?: boolean): Promise<Task> => {
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
  await redis.hset(getKey(sessionId), { [task.id]: task });
  return task;
};

export const insertMany = async (sessionId: string, tasks: Array<{ title: string; productId: number; category: string }>): Promise<Task[]> => {
  const entries: Record<string, Task> = {};
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
    entries[task.id] = task;
    result.push(task);
  }

  await redis.hset(getKey(sessionId), entries);
  return result;
};

export const insertMandatory = async (sessionId: string, tasks: Array<{ prefix: string; title: string; description: string }>): Promise<Task[]> => {
  const entries: Record<string, Task> = {};
  const result: Task[] = [];

  for (const t of tasks) {
    const now = new Date().toISOString();
    const id = `${t.prefix}-${crypto.randomUUID().slice(0, 8)}`;
    const task: Task = {
      id,
      title: t.title,
      status: 'pending',
      isMandatory: true,
      createdAt: now,
      updatedAt: now,
    };
    entries[task.id] = task;
    result.push(task);
  }

  await redis.hset(getKey(sessionId), entries);
  return result;
};

export const update = async (sessionId: string, id: string, title: string): Promise<Task | undefined> => {
  const raw = await redis.hget<string>(getKey(sessionId), id);
  if (!raw) return undefined;
  const task = safeParse(raw);
  const updated: Task = { ...task, title, updatedAt: new Date().toISOString() };
  await redis.hset(getKey(sessionId), { [id]: updated });
  return updated;
};

export const complete = async (sessionId: string, id: string): Promise<Task | undefined> => {
  const raw = await redis.hget<string>(getKey(sessionId), id);
  if (!raw) return undefined;
  const task = safeParse(raw);
  const updated: Task = { ...task, status: 'completed', updatedAt: new Date().toISOString() };
  await redis.hset(getKey(sessionId), { [id]: updated });
  return updated;
};

export const remove = async (sessionId: string, id: string): Promise<boolean> => {
  const result = await redis.hdel(getKey(sessionId), id);
  return result > 0;
};
