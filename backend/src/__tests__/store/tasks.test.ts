import * as store from '../../store/tasks';

beforeEach(() => {
  // Clear all tasks before each test
  const tasks = store.getAll();
  tasks.forEach((t) => store.remove(t.id));
});

describe('Task Store', () => {
  describe('insert', () => {
    it('should create a new task with correct properties', () => {
      const task = store.insert('Test task');

      expect(task).toHaveProperty('id');
      expect(task.title).toBe('Test task');
      expect(task.status).toBe('pending');
      expect(task).toHaveProperty('createdAt');
      expect(task).toHaveProperty('updatedAt');
    });

    it('should generate unique IDs for each task', () => {
      const task1 = store.insert('Task 1');
      const task2 = store.insert('Task 2');

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe('getAll', () => {
    it('should return an empty array when no tasks exist', () => {
      const tasks = store.getAll();
      expect(tasks).toEqual([]);
    });

    it('should return all inserted tasks', () => {
      store.insert('Task 1');
      store.insert('Task 2');

      const tasks = store.getAll();
      expect(tasks).toHaveLength(2);
    });
  });

  describe('getById', () => {
    it('should return a task by ID', () => {
      const created = store.insert('Test task');
      const found = store.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for non-existent ID', () => {
      const found = store.getById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update the task title', () => {
      const created = store.insert('Original title');
      const updated = store.update(created.id, 'Updated title');

      expect(updated).toBeDefined();
      expect(updated!.title).toBe('Updated title');
      expect(updated!.id).toBe(created.id);
    });

    it('should update the updatedAt timestamp', () => {
      const created = store.insert('Test task');
      const updated = store.update(created.id, 'New title');

      expect(updated!.updatedAt).toBeDefined();
      expect(typeof updated!.updatedAt).toBe('string');
    });

    it('should return undefined for non-existent task', () => {
      const result = store.update('non-existent-id', 'New title');
      expect(result).toBeUndefined();
    });
  });

  describe('complete', () => {
    it('should mark a task as completed', () => {
      const created = store.insert('Test task');
      const completed = store.complete(created.id);

      expect(completed).toBeDefined();
      expect(completed!.status).toBe('completed');
    });

    it('should update the updatedAt timestamp', () => {
      const created = store.insert('Test task');
      const completed = store.complete(created.id);

      expect(completed!.updatedAt).toBeDefined();
      expect(typeof completed!.updatedAt).toBe('string');
    });

    it('should return undefined for non-existent task', () => {
      const result = store.complete('non-existent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove a task and return true', () => {
      const created = store.insert('Test task');
      const result = store.remove(created.id);

      expect(result).toBe(true);
      expect(store.getById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent task', () => {
      const result = store.remove('non-existent-id');
      expect(result).toBe(false);
    });
  });
});
