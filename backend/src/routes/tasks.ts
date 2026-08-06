import { Router } from 'express';
import {
  getAllTasks,
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
router.put('/:id', validate(updateTaskSchema), updateTask);
router.patch('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

export default router;
