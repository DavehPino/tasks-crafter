import { VercelRequest, VercelResponse } from '@vercel/node';
import * as store from '../store/tasks';
import { parseBody } from '../helpers/parseBody';
import { createTaskSchema, CreateTaskDTO } from '../schemas/task';

const getAllTasks = (req: VercelRequest, res: VercelResponse): void => {
  const allTasks = store.getAll();
  const page = Math.max(1, parseInt((req.query.page as string) || '1'));
  const limit = Math.max(1, Math.min(100, parseInt((req.query.limit as string) || '5')));

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

const createTask = (req: VercelRequest, res: VercelResponse): void => {
  const body = parseBody<CreateTaskDTO>(req, res, createTaskSchema);
  if (!body) return;
  const task = store.insert(body.title);
  res.status(201).json(task);
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
    getAllTasks(req, res);
  } else if (req.method === 'POST') {
    createTask(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
