import { Request, Response } from 'express';
import * as store from '../store/tasks';
import { parseBody } from '../helpers/parseBody';
import { createTaskSchema, updateTaskSchema, CreateTaskDTO, UpdateTaskDTO } from '../schemas/task';

export const getAllTasks = (req: Request, res: Response): void => {
  // Note: Pagination is unnecessary for this POC (expected ~5-10 tasks max during a session).
  // Implemented here to demonstrate production-ready API design and pagination patterns.
  const allTasks = store.getAll();
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 5));
  
  const total = allTasks.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const tasks = allTasks.slice(start, start + limit);

  res.json({
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
};

export const getTaskById = (req: Request<{ id: string }>, res: Response): void => {
  const task = store.getById(req.params.id);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json(task);
};

export const createTask = (req: Request, res: Response): void => {
  const body = parseBody<CreateTaskDTO>(req, res, createTaskSchema);
  if (!body) return;
  const task = store.insert(body.title);
  res.status(201).json(task);
};

export const updateTask = (req: Request<{ id: string }>, res: Response): void => {
  const body = parseBody<UpdateTaskDTO>(req, res, updateTaskSchema);
  if (!body) return;
  const task = store.update(req.params.id, body.title);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json(task);
};

export const completeTask = (req: Request<{ id: string }>, res: Response): void => {
  const task = store.complete(req.params.id);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json(task);
};

export const deleteTask = (req: Request<{ id: string }>, res: Response): void => {
  const deleted = store.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.status(204).send();
};
