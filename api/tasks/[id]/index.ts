import { VercelRequest, VercelResponse } from '@vercel/node';
import * as store from '../../store/tasks.js';
import { parseBody } from '../../helpers/parseBody.js';
import { updateTaskSchema, UpdateTaskDTO } from '../../schemas/task.js';
import { setCorsHeaders, handleCors } from '../../helpers/cors.js';

const getTaskById = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const sessionId = req.headers['x-session-id'] as string;
  if (!sessionId) {
    res.status(400).json({ message: 'Missing X-Session-Id header' });
    return;
  }

  const id = req.query.id as string;
  const task = await store.getById(sessionId, id);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json(task);
};

const updateTask = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const sessionId = req.headers['x-session-id'] as string;
  if (!sessionId) {
    res.status(400).json({ message: 'Missing X-Session-Id header' });
    return;
  }

  const id = req.query.id as string;
  const body = parseBody<UpdateTaskDTO>(req, res, updateTaskSchema);
  if (!body) return;
  const task = await store.update(sessionId, id, body.title);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json(task);
};

const completeTask = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const sessionId = req.headers['x-session-id'] as string;
  if (!sessionId) {
    res.status(400).json({ message: 'Missing X-Session-Id header' });
    return;
  }

  const id = req.query.id as string;
  const task = await store.complete(sessionId, id);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json(task);
};

const deleteTask = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const sessionId = req.headers['x-session-id'] as string;
  if (!sessionId) {
    res.status(400).json({ message: 'Missing X-Session-Id header' });
    return;
  }

  const id = req.query.id as string;
  const deleted = await store.remove(sessionId, id);
  if (!deleted) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.status(204).end();
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);
  if (handleCors(req, res)) return;

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
