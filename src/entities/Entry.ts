import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Tournament } from './Tournament';
import { User } from './User';

@Entity('entries')
@Unique(['tournament', 'user'])
export class Entry {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Tournament, (t) => t.entries, { nullable: false, onDelete: 'CASCADE' })
  tournament!: Tournament;

  @ManyToOne(() => User, (u) => u.entries, { nullable: false, onDelete: 'CASCADE' })
  user!: User;

  @Column({ default: 0 })
  score!: number;
}
