import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from '../controllers/tasks';

const router = Router();

router.get('/', getAllTasks);
router.post('/', createTask);

// Not used by the frontend — the app always fetches the full list via GET /.
// Kept for API completeness so the REST interface supports all standard CRUD operations.
router.get('/:id', getTaskById);

router.put('/:id', updateTask);
router.patch('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

export default router;
