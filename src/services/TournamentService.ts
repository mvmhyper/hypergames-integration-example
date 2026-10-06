import { Service } from 'typedi';
import { AppDataSource } from '../data-source';
import { Game } from '../entities/Game';
import { Tournament, TournamentType } from '../entities/Tournament';
import { User } from '../entities/User';
import { EntryService } from './EntryService';
import { Entry } from '../entities/Entry';
import { fail } from '../http-error';

@Service()
export class TournamentService {
  private tournaments = AppDataSource.getRepository(Tournament);
  private games = AppDataSource.getRepository(Game);
  private users = AppDataSource.getRepository(User);

  constructor(private entries: EntryService) {}

  async start(data: { name: string; game_slug: string; type: TournamentType; participant_limit: number }): Promise<Tournament> {
    if (!data.name || !data.game_slug || !data.type || data.participant_limit == null) {
      fail(400, 'name, game_slug, type and participant_limit are required');
    }
    if (data.type !== 'PVP' && data.type !== 'MULTI') fail(400, 'type must be PVP or MULTI');
    const game = await this.games.findOneBy({ slug: data.game_slug });
    if (!game) fail(404, 'game not found');
    return this.tournaments.save(
      this.tournaments.create({ name: data.name, game: game!, type: data.type, participant_limit: data.participant_limit }),
    );
  }

  async play(id: number, username: string): Promise<Entry> {
    if (!username) fail(400, 'username is required');
    const user = await this.users.findOneBy({ username });
    if (!user) fail(404, 'user not found');
    return this.entries.create(id, user!.id);
  }

  async get(id: number): Promise<Tournament> {
    const tournament = await this.tournaments.findOne({
      where: { id },
      relations: { game: true, entries: { user: true } },
    });
    if (!tournament) fail(404, 'tournament not found');
    return tournament!;
  }
}
