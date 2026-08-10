import { z } from 'zod';

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['pending', 'completed']),
  productId: z.number().optional(),
  category: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
});

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
