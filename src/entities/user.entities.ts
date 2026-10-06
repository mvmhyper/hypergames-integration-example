import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entry } from './entry.entities';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @OneToMany(() => Entry, (e) => e.user)
  entries!: Entry[];
}
