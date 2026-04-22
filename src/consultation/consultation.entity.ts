import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Doctor } from './doctor.entity';

export type ConsultationStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

@Entity('consultations')
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  patient: User;

  @ManyToOne(() => Doctor, { onDelete: 'CASCADE' })
  doctor: Doctor;

  @Column({ type: 'timestamptz' })
  scheduledAt: Date;

  @Column({ default: 'scheduled' })
  status: ConsultationStatus;

  @Column({ nullable: true })
  dailyRoomName: string;

  @Column({ nullable: true })
  dailyRoomUrl: string;

  @Column({ nullable: true })
  patientToken: string;

  @Column({ nullable: true })
  doctorToken: string;

  @CreateDateColumn()
  createdAt: Date;
}
