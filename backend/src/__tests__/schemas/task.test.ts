import { createTaskSchema, updateTaskSchema } from '../../schemas/task';

describe('Task Schemas', () => {
  describe('createTaskSchema', () => {
    it('should accept a valid title', () => {
      const result = createTaskSchema.safeParse({ title: 'Valid task' });
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = createTaskSchema.safeParse({ title: '' });
      expect(result.success).toBe(false);
    });

    it('should reject title longer than 255 characters', () => {
      const longTitle = 'a'.repeat(256);
      const result = createTaskSchema.safeParse({ title: longTitle });
      expect(result.success).toBe(false);
    });

    it('should accept title with exactly 255 characters', () => {
      const maxTitle = 'a'.repeat(255);
      const result = createTaskSchema.safeParse({ title: maxTitle });
      expect(result.success).toBe(true);
    });

    it('should reject missing title field', () => {
      const result = createTaskSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject non-string title', () => {
      const result = createTaskSchema.safeParse({ title: 123 });
      expect(result.success).toBe(false);
    });
  });

  describe('updateTaskSchema', () => {
    it('should accept a valid title', () => {
      const result = updateTaskSchema.safeParse({ title: 'Updated task' });
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = updateTaskSchema.safeParse({ title: '' });
      expect(result.success).toBe(false);
    });

    it('should reject title longer than 255 characters', () => {
      const longTitle = 'a'.repeat(256);
      const result = updateTaskSchema.safeParse({ title: longTitle });
      expect(result.success).toBe(false);
    });

    it('should reject missing title field', () => {
      const result = updateTaskSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
