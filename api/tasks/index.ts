import { VercelRequest, VercelResponse } from '@vercel/node';
import * as store from '../store/tasks.js';
import { parseBody } from '../helpers/parseBody.js';
import { createTaskSchema, CreateTaskDTO } from '../schemas/task.js';
import { setCorsHeaders, handleCors } from '../helpers/cors.js';

const MANDATORY_TASKS = [
  {
    prefix: 'mandatory-av-check',
    title: 'Test audio/video equipment',
    description: 'Verify cameras, microphones, and streaming software are working correctly',
  },
  {
    prefix: 'mandatory-inventory',
    title: 'Confirm product inventory',
    description: 'Ensure all products have sufficient stock for the live session',
  },
  {
    prefix: 'mandatory-pricing',
    title: 'Review pricing and descriptions',
    description: 'Verify all product prices, discounts, and descriptions are accurate',
  },
];

const getAllTasks = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const sessionId = req.headers['x-session-id'] as string;
  if (!sessionId) {
    res.status(400).json({ message: 'Missing X-Session-Id header' });
    return;
  }

  const existingTasks = await store.getAll(sessionId);
  const mandatoryExists = existingTasks.some(t => t.isMandatory);

  if (!mandatoryExists) {
    await store.insertMandatory(sessionId, MANDATORY_TASKS);
  }

  const allTasks = await store.getAll(sessionId);
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

const createTask = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const sessionId = req.headers['x-session-id'] as string;
  if (!sessionId) {
    res.status(400).json({ message: 'Missing X-Session-Id header' });
    return;
  }

  const body = parseBody<CreateTaskDTO>(req, res, createTaskSchema);
  if (!body) return;
  const task = await store.insert(sessionId, body.title);
  res.status(201).json(task);
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    getAllTasks(req, res);
  } else if (req.method === 'POST') {
    createTask(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
