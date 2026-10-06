import { Request, Response } from 'express';
import { Service } from 'typedi';
import { GameService } from '../services/game.service';

@Service()
export class GameController {
  constructor(private games: GameService) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.games.list());
  };

  create = async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await this.games.create(req.body));
  };
}
