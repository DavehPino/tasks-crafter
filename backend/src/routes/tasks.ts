import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from '../controllers/tasks';
import { validate } from '../middlewares/validate';
import { createTaskSchema, updateTaskSchema } from '../schemas/task';

const router = Router();

router.get('/', getAllTasks);
router.post('/', validate(createTaskSchema), createTask);

// Not used by the frontend — the app always fetches the full list via GET /.
// Kept for API completeness so the REST interface supports all standard CRUD operations.
router.get('/:id', getTaskById);

router.put('/:id', validate(updateTaskSchema), updateTask);
router.patch('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

export default router;
