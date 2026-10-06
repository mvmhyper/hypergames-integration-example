import { Service } from 'typedi';
import { AppDataSource } from '../data-source';
import { Game } from '../entities/game.entities';
import { fail } from '../http-error';

@Service()
export class GameService {
  private repo = AppDataSource.getRepository(Game);

  async create(data: Partial<Game>): Promise<Game> {
    if (!data.slug || !data.name || data.time_limit == null || !data.url) fail(400, 'slug, name, time_limit and url are required');
    if (await this.repo.findOneBy({ slug: data.slug! })) fail(409, 'slug is taken');
    return this.repo.save(this.repo.create(data));
  }
}
