import { Request, Response } from 'express';

export const getAllTasks = (_req: Request, res: Response): void => {
  res.json([]);
};

export const createTask = (_req: Request, res: Response): void => {
  res.status(201).json({});
};

export const updateTask = (_req: Request, res: Response): void => {
  res.json({});
};

export const completeTask = (_req: Request, res: Response): void => {
  res.json({});
};

export const deleteTask = (_req: Request, res: Response): void => {
  res.status(204).send();
};
