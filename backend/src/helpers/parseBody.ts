import { Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const parseBody = <T>(
  req: Request,
  res: Response,
  schema: ZodSchema
): T | null => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({ errors });
    return null;
  }
  return result.data as T;
};
