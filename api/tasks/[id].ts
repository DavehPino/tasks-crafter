import { VercelRequest, VercelResponse } from '@vercel/node';
import * as store from '../store/tasks';
import { parseBody } from '../helpers/parseBody';
import { updateTaskSchema, UpdateTaskDTO } from '../schemas/task';

const getTaskById = (req: VercelRequest, res: VercelResponse): void => {
  const id = req.query.id as string;
  const task = store.getById(id);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json(task);
};

const updateTask = (req: VercelRequest, res: VercelResponse): void => {
  const id = req.query.id as string;
  const body = parseBody<UpdateTaskDTO>(req, res, updateTaskSchema);
  if (!body) return;
  const task = store.update(id, body.title);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json(task);
};

const completeTask = (req: VercelRequest, res: VercelResponse): void => {
  const id = req.query.id as string;
  const task = store.complete(id);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json(task);
};

const deleteTask = (req: VercelRequest, res: VercelResponse): void => {
  const id = req.query.id as string;
  const deleted = store.remove(id);
  if (!deleted) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.status(204).send();
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    getTaskById(req, res);
  } else if (req.method === 'PUT') {
    updateTask(req, res);
  } else if (req.method === 'PATCH') {
    completeTask(req, res);
  } else if (req.method === 'DELETE') {
    deleteTask(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
