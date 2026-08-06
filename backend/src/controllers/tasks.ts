import { Request, Response } from 'express';
import * as store from '../store/tasks';
import type { CreateTaskDTO, UpdateTaskDTO } from '../schemas/task';

export const getAllTasks = (_req: Request, res: Response): void => {
  res.json(store.getAll());
};

export const getTaskById = (req: Request<{ id: string }>, res: Response): void => {
  const task = store.getById(req.params.id);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json(task);
};

export const createTask = (req: Request<{}, {}, CreateTaskDTO>, res: Response): void => {
  const task = store.insert(req.body.title);
  res.status(201).json(task);
};

export const updateTask = (req: Request<{ id: string }, {}, UpdateTaskDTO>, res: Response): void => {
  const task = store.update(req.params.id, req.body.title);
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
