import { Request, Response, NextFunction } from 'express';

export function webhookAuth(req: Request, res: Response, next: NextFunction): void {
  const expected = process.env.GS_WEBHOOK_KEY;
  if (!expected || req.headers.authorization !== `Bearer ${expected}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}
