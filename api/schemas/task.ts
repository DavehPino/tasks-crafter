import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
});

export const bulkCreateTasksSchema = z.object({
  productIds: z.array(z.number()).min(1, 'At least one product is required'),
  products: z.array(z.object({
    id: z.number(),
    title: z.string(),
    category: z.string(),
  })).optional(),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
export type BulkCreateTasksDTO = z.infer<typeof bulkCreateTasksSchema>;
