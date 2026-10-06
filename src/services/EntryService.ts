import { Service } from 'typedi';
import { AppDataSource } from '../data-source';
import { Entry } from '../entities/Entry';
import { Tournament } from '../entities/Tournament';
import { User } from '../entities/User';
import { fail } from '../http-error';

@Service()
export class EntryService {
  private entries = AppDataSource.getRepository(Entry);
  private tournaments = AppDataSource.getRepository(Tournament);
  private users = AppDataSource.getRepository(User);

  async create(tournamentId: number, userId: number): Promise<Entry> {
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

  async setScore(id: number, score: number): Promise<Entry> {
    if (score == null) fail(400, 'score is required');
    const entry = await this.entries.findOneBy({ id });
    if (!entry) fail(404, 'entry not found');
    entry!.score = score;
    return this.entries.save(entry!);
  }
}
