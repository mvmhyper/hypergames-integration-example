import { Request, Response } from 'express';
import { Service } from 'typedi';
import { EntryService } from '../services/entry.service';

@Service()
export class EntryController {
  constructor(private entries: EntryService) {}

  setScore = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.entries.setScore(req.body));
  };
}
