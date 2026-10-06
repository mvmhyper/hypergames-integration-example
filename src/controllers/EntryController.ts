import { Request, Response } from 'express';
import { Service } from 'typedi';
import { EntryService } from '../services/EntryService';

@Service()
export class EntryController {
  constructor(private entries: EntryService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await this.entries.create(req.body.tournament_id, req.body.user_id));
  };

  setScore = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.entries.setScore(Number(req.params.id), req.body.score));
  };
}
