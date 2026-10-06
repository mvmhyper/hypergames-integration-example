import { Service } from 'typedi';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entities';
import { fail } from '../http-error';

@Service()
export class UserService {
  private repo = AppDataSource.getRepository(User);

  async create(username: string): Promise<User> {
    if (!username) fail(400, 'username is required');
    if (await this.repo.findOneBy({ username })) fail(409, 'username is taken');
    return this.repo.save(this.repo.create({ username }));
  }
}
