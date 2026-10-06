import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Tournament } from './tournament.entities';
import { User } from './user.entities';

@Entity('entries')
@Unique(['tournament', 'user'])
export class Entry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tournament, (t) => t.entries, { nullable: false, onDelete: 'CASCADE' })
  tournament!: Tournament;

  @ManyToOne(() => User, (u) => u.entries, { nullable: false, onDelete: 'CASCADE' })
  user!: User;

  @Column({ default: 0 })
  score!: number;

  @Column({ default: 0 })
  time!: number;

  @Column({ default: 0 })
  level!: number;
}
