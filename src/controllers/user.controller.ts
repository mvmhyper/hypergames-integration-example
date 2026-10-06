import { Request, Response } from 'express';
import { Service } from 'typedi';
import { UserService } from '../services/user.service';

@Service()
export class UserController {
  constructor(private users: UserService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await this.users.create(req.body.username));
  };
}
