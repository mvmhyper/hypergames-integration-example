import { DataSource } from 'typeorm';
import { User } from './entities/user.entities';
import { Game } from './entities/game.entities';
import { Tournament } from './entities/tournament.entities';
import { Entry } from './entities/entry.entities';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? 'root',
  database: process.env.DB_NAME ?? 'testapi',
  entities: [User, Game, Tournament, Entry],
  synchronize: true,
});

export async function initDb(retries = 30): Promise<void> {
  for (let i = 1; ; i++) {
    try {
      await AppDataSource.initialize();
      return;
    } catch (err) {
      if (i >= retries) throw err;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}
