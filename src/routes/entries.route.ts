import { Router } from 'express';
import { Container } from 'typedi';
import { EntryController } from '../controllers/entry.controller';

const router = Router();
const c = Container.get(EntryController);

router.post('/', c.create);
router.post('/:id/score', c.setScore);

export default router;
