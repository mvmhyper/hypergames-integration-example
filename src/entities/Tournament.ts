import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './Game';
import { Entry } from './Entry';

export type TournamentType = 'PVP' | 'MULTI';

@Entity('tournament')
export class Tournament {
  @PrimaryGeneratedColumn()
  id!: number;

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
