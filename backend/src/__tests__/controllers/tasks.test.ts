import * as store from '../../store/tasks';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from '../../controllers/tasks';

const mockRes = () => {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  return res;
};

beforeEach(() => {
  const tasks = store.getAll();
  tasks.forEach((t) => store.remove(t.id));
});

describe('Task Controllers', () => {
  describe('getAllTasks', () => {
    it('should return paginated tasks with default pagination', () => {
      store.insert('Task 1');
      store.insert('Task 2');

      const req = { query: {} } as any;
      const res = mockRes();

      getAllTasks(req, res);

      expect(res.json).toHaveBeenCalledWith({
        tasks: expect.arrayContaining([
          expect.objectContaining({ title: 'Task 1' }),
          expect.objectContaining({ title: 'Task 2' }),
        ]),
        pagination: {
          page: 1,
          limit: 5,
          total: 2,
          totalPages: 1,
        },
      });
    });

    it('should handle custom page and limit', () => {
      for (let i = 1; i <= 10; i++) {
        store.insert(`Task ${i}`);
      }

      const req = { query: { page: '2', limit: '3' } } as any;
      const res = mockRes();

      getAllTasks(req, res);

      const call = res.json.mock.calls[0][0];
      expect(call.tasks).toHaveLength(3);
      expect(call.pagination.page).toBe(2);
      expect(call.pagination.limit).toBe(3);
      expect(call.pagination.total).toBe(10);
      expect(call.pagination.totalPages).toBe(4);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', () => {
      const created = store.insert('Test task');
      const req = { params: { id: created.id } } as any;
      const res = mockRes();

      getTaskById(req, res);

      expect(res.json).toHaveBeenCalledWith(created);
    });

    it('should return 404 for non-existent task', () => {
      const req = { params: { id: 'non-existent' } } as any;
      const res = mockRes();

      getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('createTask', () => {
    it('should create a task and return 201', () => {
      const req = { body: { title: 'New task' } } as any;
      const res = mockRes();

      createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'New task', status: 'pending' })
      );
    });

    it('should return 400 for invalid body', () => {
      const req = { body: { title: '' } } as any;
      const res = mockRes();

      createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Array) })
      );
    });
  });

  describe('updateTask', () => {
    it('should update a task title', () => {
      const created = store.insert('Original');
      const req = { params: { id: created.id }, body: { title: 'Updated' } } as any;
      const res = mockRes();

      updateTask(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Updated' })
      );
    });

    it('should return 404 for non-existent task', () => {
      const req = { params: { id: 'non-existent' }, body: { title: 'Updated' } } as any;
      const res = mockRes();

      updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 for invalid body', () => {
      const req = { params: { id: 'any' }, body: { title: '' } } as any;
      const res = mockRes();

      updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('completeTask', () => {
    it('should mark a task as completed', () => {
      const created = store.insert('Test task');
      const req = { params: { id: created.id } } as any;
      const res = mockRes();

      completeTask(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'completed' })
      );
    });

    it('should return 404 for non-existent task', () => {
      const req = { params: { id: 'non-existent' } } as any;
      const res = mockRes();

      completeTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return 204', () => {
      const created = store.insert('Test task');
      const req = { params: { id: created.id } } as any;
      const res = mockRes();

      deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(store.getById(created.id)).toBeUndefined();
    });

    it('should return 404 for non-existent task', () => {
      const req = { params: { id: 'non-existent' } } as any;
      const res = mockRes();

      deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
