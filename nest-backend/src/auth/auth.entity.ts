import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../types';

@Entity({ name: 'users' })
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullname: string;

  @Column({ default: true })
  @Exclude()
  active: boolean;

  @CreateDateColumn()
  @Exclude()
  createdOn: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedOn: Date;

  @Column({ default: UserRole.USER })
  @Exclude()
  role: UserRole;
}
