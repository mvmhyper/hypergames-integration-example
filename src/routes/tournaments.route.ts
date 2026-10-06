import { Router } from 'express';
import { Container } from 'typedi';
import { TournamentController } from '../controllers/tournament.controller';

const router = Router();
const c = Container.get(TournamentController);

router.post('/', c.start);
router.post('/:id/play', c.play);
router.get('/:id', c.get);

export default router;
