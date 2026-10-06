import { Router } from 'express';
import { Container } from 'typedi';
import { EntryController } from '../controllers/entry.controller';
import { webhookAuth } from '../middleware/webhook-auth';

const router = Router();
const c = Container.get(EntryController);

router.post('/', c.create);
router.post('/score', webhookAuth, c.setScore);

export default router;
