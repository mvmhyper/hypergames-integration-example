import { Request, Response } from 'express';
import { Service } from 'typedi';
import { TournamentService } from '../services/TournamentService';

@Service()
export class TournamentController {
  constructor(private tournaments: TournamentService) {}

  start = async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await this.tournaments.start(req.body));
  };

  play = async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await this.tournaments.play(Number(req.params.id), req.body.username));
  };

  get = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.tournaments.get(Number(req.params.id)));
  };
}
