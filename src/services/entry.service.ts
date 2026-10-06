import { Service } from 'typedi';
import { AppDataSource } from '../data-source';
import { Entry } from '../entities/entry.entities';
import { Tournament } from '../entities/tournament.entities';
import { User } from '../entities/user.entities';
import { fail } from '../http-error';

export interface ScoreSubmission {
  entryId: string;
  tournamentId?: string;
  gameId?: string;
  score?: number;
  time?: number;
  level?: number;
  pvp?: boolean;
  isValid?: boolean;
}

@Service()
export class EntryService {
  private entries = AppDataSource.getRepository(Entry);
  private tournaments = AppDataSource.getRepository(Tournament);
  private users = AppDataSource.getRepository(User);

  async create(tournamentId: string, userId: string): Promise<Entry> {
    const tournament = await this.tournaments.findOneBy({ id: tournamentId });
    if (!tournament) fail(404, 'tournament not found');
    const user = await this.users.findOneBy({ id: userId });
    if (!user) fail(404, 'user not found');
    if (await this.entries.findOneBy({ tournament: { id: tournamentId }, user: { id: userId } })) {
      fail(409, 'user already entered');
    }
    const cap = tournament!.type === 'PVP' ? 2 : tournament!.participant_limit;
    const count = await this.entries.countBy({ tournament: { id: tournamentId } });
    if (count >= cap) fail(400, 'tournament is full');
    return this.entries.save(this.entries.create({ tournament: tournament!, user: user! }));
  }

  async setScore(data: ScoreSubmission): Promise<Entry> {
    if (!data || !data.entryId) fail(400, 'entryId is required');
    if (data.score == null) fail(400, 'score is required');
    if (data.isValid === false) fail(400, 'score is not valid');
    const entry = await this.entries.findOne({
      where: { id: data.entryId },
      relations: { tournament: { game: true }, user: true },
    });
    if (!entry) fail(404, 'entry not found');
    if (data.tournamentId && entry!.tournament.id !== data.tournamentId) fail(400, 'tournament mismatch');
    if (data.gameId && entry!.tournament.game.id !== data.gameId) fail(400, 'game mismatch');
    entry!.score = data.score!;
    if (data.time != null) entry!.time = data.time;
    if (data.level != null) entry!.level = data.level;
    return this.entries.save(entry!);
  }
}
