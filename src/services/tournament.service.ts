import { Service } from 'typedi';
import { AppDataSource } from '../data-source';
import { Game } from '../entities/game.entities';
import { Tournament, TournamentType } from '../entities/tournament.entities';
import { User } from '../entities/user.entities';
import { EntryService } from './entry.service';
import { Entry } from '../entities/entry.entities';
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

  async play(id: string, username: string): Promise<{ entry: Entry; playUrl: string }> {
    if (!username) fail(400, 'username is required');
    const tournament = await this.tournaments.findOne({ where: { id }, relations: { game: true } });
    if (!tournament) fail(404, 'tournament not found');
    const user = await this.users.findOneBy({ username });
    if (!user) fail(404, 'user not found');
    const entry = await this.entries.create(id, user!.id);
    return { entry, playUrl: this.playUrl(tournament!, tournament!.game, user!, entry) };
  }

  private playUrl(tournament: Tournament, game: Game, user: User, entry: Entry): string {
    const url = new URL(game.url);
    const host = process.env.APP_URL ?? 'http://localhost:3000';
    url.searchParams.set('tournamentId', tournament.id);
    url.searchParams.set('host', `${host}/api`);
    url.searchParams.set('time', String(game.time_limit));
    url.searchParams.set('entryId', entry.id);
    url.searchParams.set('gameId', game.id);
    url.searchParams.set('userName', user.username);
    url.searchParams.set('userId', user.id);
    url.searchParams.set('sound', 'on');
    url.searchParams.set('pvp', String(tournament.type === 'PVP'));
    return url.toString();
  }

  async get(id: string): Promise<Tournament> {
    const tournament = await this.tournaments.findOne({
      where: { id },
      relations: { game: true, entries: { user: true } },
    });
    if (!tournament) fail(404, 'tournament not found');
    return tournament!;
  }
}
