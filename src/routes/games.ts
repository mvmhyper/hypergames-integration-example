import { Router } from 'express';
import { Container } from 'typedi';
import { GameController } from '../controllers/GameController';

const router = Router();
const c = Container.get(GameController);

router.post('/', c.create);

export default router;
