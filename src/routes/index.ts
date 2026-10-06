import { Router, Request, Response } from 'express';
import usersRouter from './users';
import gamesRouter from './games';
import tournamentsRouter from './tournaments';
import entriesRouter from './entries';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Service Up' });
});

router.use('/users', usersRouter);
router.use('/games', gamesRouter);
router.use('/tournaments', tournamentsRouter);
router.use('/entries', entriesRouter);

export default router;
