import { VercelRequest, VercelResponse } from '@vercel/node';
import * as store from '../store/tasks.js';
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

const initializeMandatoryTasks = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const existingTasks = await store.getAll();
  const mandatoryExists = existingTasks.some(t => t.isMandatory);

  if (mandatoryExists) {
    const mandatoryTasks = existingTasks.filter(t => t.isMandatory);
    res.json({ tasks: mandatoryTasks, alreadyInitialized: true });
    return;
  }

  const created = await store.insertMandatory(MANDATORY_TASKS);
  res.status(201).json({ tasks: created, alreadyInitialized: false });
};

const getMandatoryStatus = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const allTasks = await store.getAll();
  const mandatoryTasks = allTasks.filter(t => t.isMandatory);

  const total = MANDATORY_TASKS.length;
  const completed = mandatoryTasks.filter(t => t.status === 'completed').length;
  const allCompleted = completed === total;

  res.json({
    mandatoryTasks,
    total,
    completed,
    allCompleted,
    canGoLive: allCompleted,
  });
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);
  if (handleCors(req, res)) return;

  if (req.method === 'POST') {
    initializeMandatoryTasks(req, res);
  } else if (req.method === 'GET') {
    getMandatoryStatus(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
