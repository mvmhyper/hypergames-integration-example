import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tournament } from './Tournament';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

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
