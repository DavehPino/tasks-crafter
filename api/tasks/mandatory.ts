import { VercelRequest, VercelResponse } from '@vercel/node';
import * as store from '../store/tasks.js';

const MANDATORY_TASKS = [
  {
    id: 'mandatory-av-check',
    title: 'Test audio/video equipment',
    description: 'Verify cameras, microphones, and streaming software are working correctly',
  },
  {
    id: 'mandatory-inventory',
    title: 'Confirm product inventory',
    description: 'Ensure all products have sufficient stock for the live session',
  },
  {
    id: 'mandatory-pricing',
    title: 'Review pricing and descriptions',
    description: 'Verify all product prices, discounts, and descriptions are accurate',
  },
];

const initializeMandatoryTasks = (req: VercelRequest, res: VercelResponse): void => {
  // Check if mandatory tasks already exist
  const existingTasks = store.getAll();
  const mandatoryExists = MANDATORY_TASKS.some(t => existingTasks.some(et => et.id === t.id));

  if (mandatoryExists) {
    // Return existing mandatory tasks
    const mandatoryTasks = existingTasks.filter(t => t.isMandatory);
    res.json({ tasks: mandatoryTasks, alreadyInitialized: true });
    return;
  }

  // Create mandatory tasks
  const created = store.insertMandatory(MANDATORY_TASKS);
  res.status(201).json({ tasks: created, alreadyInitialized: false });
};

const getMandatoryStatus = (req: VercelRequest, res: VercelResponse): void => {
  const allTasks = store.getAll();
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

  if (req.method === 'POST') {
    initializeMandatoryTasks(req, res);
  } else if (req.method === 'GET') {
    getMandatoryStatus(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
