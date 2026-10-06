import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tournament } from './tournament.entities';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  name!: string;

  @Column()
  time_limit!: number;

  @Column()
  url!: string;

  @OneToMany(() => Tournament, (t) => t.game)
  tournaments!: Tournament[];
}
