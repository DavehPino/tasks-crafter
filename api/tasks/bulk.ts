import { VercelRequest, VercelResponse } from '@vercel/node';
import * as store from '../store/tasks.js';
import { parseBody } from '../helpers/parseBody.js';
import { bulkCreateTasksSchema, BulkCreateTasksDTO } from '../schemas/task.js';
import { setCorsHeaders, handleCors } from '../helpers/cors.js';

// Auto-generate prep tasks for each product
const generateTasksForProduct = (productId: number, productTitle: string, category: string) => {
  const shortTitle = productTitle.length > 30 ? productTitle.substring(0, 30) + '...' : productTitle;
  return [
    {
      title: `Prepare description for "${shortTitle}"`,
      productId,
      category,
    },
    {
      title: `Confirm stock for "${shortTitle}"`,
      productId,
      category,
    },
    {
      title: `Create graphics for "${shortTitle}"`,
      productId,
      category,
    },
  ];
};

const bulkCreateTasks = (req: VercelRequest, res: VercelResponse): void => {
  const body = parseBody<BulkCreateTasksDTO>(req, res, bulkCreateTasksSchema);
  if (!body) return;

  // If products data is provided, use it. Otherwise, we just generate tasks with IDs.
  const tasks = body.products
    ? body.products.flatMap(p => generateTasksForProduct(p.id, p.title, p.category))
    : body.productIds.flatMap(id => generateTasksForProduct(id, `Product ${id}`, 'uncategorized'));

  const created = store.insertMany(tasks);
  res.status(201).json({
    tasks: created,
    count: created.length,
  });
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);
  if (handleCors(req, res)) return;

  if (req.method === 'POST') {
    bulkCreateTasks(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
