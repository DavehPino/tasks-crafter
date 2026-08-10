import { createTaskSchema, updateTaskSchema, taskSchema } from '../../schemas/task';

describe('Frontend Task Schemas', () => {
  describe('taskSchema', () => {
    it('should validate a complete task object', () => {
      const validTask = {
        id: '123',
        title: 'Test task',
        status: 'pending',
        createdAt: '2026-08-06T00:00:00.000Z',
        updatedAt: '2026-08-06T00:00:00.000Z',
      };

      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should validate a completed task', () => {
      const completedTask = {
        id: '123',
        title: 'Test task',
        status: 'completed',
        createdAt: '2026-08-06T00:00:00.000Z',
        updatedAt: '2026-08-06T00:00:00.000Z',
      };

      const result = taskSchema.safeParse(completedTask);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const invalidTask = {
        id: '123',
        title: 'Test task',
        status: 'invalid',
        createdAt: '2026-08-06T00:00:00.000Z',
        updatedAt: '2026-08-06T00:00:00.000Z',
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });
  });

  describe('createTaskSchema', () => {
    it('should accept valid title', () => {
      const result = createTaskSchema.safeParse({ title: 'Valid task' });
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = createTaskSchema.safeParse({ title: '' });
      expect(result.success).toBe(false);
    });

    it('should reject title > 255 chars', () => {
      const result = createTaskSchema.safeParse({ title: 'a'.repeat(256) });
      expect(result.success).toBe(false);
    });
  });

  describe('updateTaskSchema', () => {
    it('should accept valid title', () => {
      const result = updateTaskSchema.safeParse({ title: 'Updated task' });
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = updateTaskSchema.safeParse({ title: '' });
      expect(result.success).toBe(false);
    });
  });
});
