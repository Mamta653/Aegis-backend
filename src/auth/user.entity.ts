import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // New field

  @Column({ nullable: true })
  phone: string; // New field

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  age: number; // New field

  @Column({ nullable: true })
  gender: string; // New field

  @Column()
  password: string;
}