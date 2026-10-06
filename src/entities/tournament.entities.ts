import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entities';
import { Entry } from './entry.entities';

export type TournamentType = 'PVP' | 'MULTI';

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Game, (g) => g.tournaments, { nullable: false })
  game!: Game;

  @Column({ type: 'enum', enum: ['PVP', 'MULTI'] })
  type!: TournamentType;

  @Column()
  participant_limit!: number;

  @OneToMany(() => Entry, (e) => e.tournament)
  entries!: Entry[];
}
