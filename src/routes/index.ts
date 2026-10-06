import { Router, Request, Response } from 'express';
import usersRouter from './users.route';
import gamesRouter from './games.route';
import tournamentsRouter from './tournaments.route';
import entriesRouter from './entries.route';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Service Up' });
});

router.use('/users', usersRouter);
router.use('/games', gamesRouter);
router.use('/tournaments', tournamentsRouter);
router.use('/entries', entriesRouter);

export default router;
