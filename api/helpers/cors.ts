import { VercelRequest, VercelResponse } from '@vercel/node';

export const setCorsHeaders = (req: VercelRequest, res: VercelResponse): void => {
  const origin = req.headers.origin || '*';

  // For POC: allow all origins
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Access-Control-Max-Age', '86400');
};

export const handleCors = (req: VercelRequest, res: VercelResponse): boolean => {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
};
