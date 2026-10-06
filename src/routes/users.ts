import { Router } from 'express';
import { Container } from 'typedi';
import { UserController } from '../controllers/UserController';

const router = Router();
const c = Container.get(UserController);

router.post('/', c.create);

export default router;
