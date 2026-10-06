import { Router } from 'express';
import { Container } from 'typedi';
import { GameController } from '../controllers/game.controller';

const router = Router();
const c = Container.get(GameController);

router.get('/', c.list);
router.post('/', c.create);

export default router;
