import { z } from 'zod';
import { parseBody } from '../../helpers/parseBody';

const mockSchema = z.object({
  title: z.string().min(1),
});

describe('parseBody', () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return parsed data when validation succeeds', () => {
    const req = { body: { title: 'Valid title' } } as any;
    const result = parseBody(req, mockRes, mockSchema);

    expect(result).toEqual({ title: 'Valid title' });
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return null and send 400 error when validation fails', () => {
    const req = { body: { title: '' } } as any;
    const result = parseBody(req, mockRes, mockSchema);

    expect(result).toBeNull();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({
          field: 'title',
          message: expect.any(String),
        }),
      ]),
    });
  });

  it('should return null and send 400 error when body is missing required fields', () => {
    const req = { body: {} } as any;
    const result = parseBody(req, mockRes, mockSchema);

    expect(result).toBeNull();
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
