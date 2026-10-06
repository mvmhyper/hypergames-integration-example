import { Service } from 'typedi';
import { AppDataSource } from '../data-source';
import { Game } from '../entities/game.entities';
import { Tournament, TournamentType } from '../entities/tournament.entities';
import { User } from '../entities/user.entities';
import { EntryService } from './entry.service';
import { Entry } from '../entities/entry.entities';
import { fail } from '../http-error';

export interface TournamentJson {
  id: string;
  name: string;
  game: { slug: string; name: string; time_limit: number };
  type: TournamentType;
  participant_limit: number;
}

export function toJson(t: Tournament): TournamentJson {
  return {
    id: t.id,
    name: t.name,
    game: { slug: t.game.slug, name: t.game.name, time_limit: t.game.time_limit },
    type: t.type,
    participant_limit: t.participant_limit,
  };
}

@Service()
export class TournamentService {
  private tournaments = AppDataSource.getRepository(Tournament);
  private games = AppDataSource.getRepository(Game);
  private users = AppDataSource.getRepository(User);

  constructor(private entries: EntryService) {}

  async start(data: { name: string; game_slug: string; type: TournamentType; participant_limit: number }): Promise<TournamentJson> {
    if (!data.name || !data.game_slug || !data.type || data.participant_limit == null) {
      fail(400, 'name, game_slug, type and participant_limit are required');
    }
    if (data.type !== 'PVP' && data.type !== 'MULTI') fail(400, 'type must be PVP or MULTI');
    const game = await this.games.findOneBy({ slug: data.game_slug });
    if (!game) fail(404, 'game not found');
    const created = await this.tournaments.save(
      this.tournaments.create({ name: data.name, game: game!, type: data.type, participant_limit: data.participant_limit }),
    );
    return toJson(created);
  }

  async play(id: string, username: string): Promise<{ playUrl: string }> {
    if (!username) fail(400, 'username is required');
    const tournament = await this.tournaments.findOne({ where: { id }, relations: { game: true } });
    if (!tournament) fail(404, 'tournament not found');
    const user = await this.users.findOneBy({ username });
    if (!user) fail(404, 'user not found');
    const entry = await this.entries.create(id, user!.id);
    return { playUrl: this.playUrl(tournament!, tournament!.game, user!, entry) };
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

  async list(page: number, limit: number): Promise<{ data: TournamentJson[]; page: number; limit: number; total: number }> {
    page = Math.max(1, Math.floor(page) || 1);
    limit = Math.min(100, Math.max(1, Math.floor(limit) || 20));
    const [rows, total] = await this.tournaments.findAndCount({
      relations: { game: true },
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: rows.map(toJson), page, limit, total };
  }

  async get(id: string): Promise<TournamentJson & { entries: { user: { username: string }; score: number; time: number; position: number }[] }> {
    const tournament = await this.tournaments.findOne({
      where: { id },
      relations: { game: true, entries: { user: true } },
    });
    if (!tournament) fail(404, 'tournament not found');
    const ranked = [...tournament!.entries].sort((a, b) => b.score - a.score);
    return {
      ...toJson(tournament!),
      entries: tournament!.entries.map((e) => ({
        user: { username: e.user.username },
        score: e.score,
        time: e.time,
        position: ranked.findIndex((r) => r.id === e.id) + 1,
      })),
    };
  }
}
