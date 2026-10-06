import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entry } from './Entry';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @OneToMany(() => Entry, (e) => e.user)
  entries!: Entry[];
}
