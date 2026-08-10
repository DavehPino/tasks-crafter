import { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, handleCors } from './helpers/cors.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);
  if (handleCors(req, res)) return;

  res.json({ status: 'ok' });
}
