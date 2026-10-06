import { Request, Response } from 'express';
import { Service } from 'typedi';
import { GameService } from '../services/GameService';

@Service()
export class GameController {
  constructor(private games: GameService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await this.games.create(req.body));
  };
}
