import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation } from './consultation.entity';
import { Doctor } from './doctor.entity';
import axios from 'axios';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  // ── Get all available doctors ──
  async getDoctors(): Promise<Doctor[]> {
    return this.doctorRepository.find({ where: { isAvailable: true } });
  }

  // ── Book a consultation ──
  async bookConsultation(
    patientId: number,
    doctorId: number,
    scheduledAt: string,
  ) {
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    // Create a Daily.co room
    const room = await this.createDailyRoom();

    // Create patient token
    const patientToken = await this.createDailyToken(room.name, 'patient');

    // Create doctor token
    const doctorToken = await this.createDailyToken(room.name, 'doctor');

    // Save consultation to DB
    const consultation = this.consultationRepository.create({
      patient: { id: patientId },
      doctor: { id: doctorId },
      scheduledAt: new Date(scheduledAt),
      status: 'scheduled',
      dailyRoomName: room.name,
      dailyRoomUrl: room.url,
      patientToken,
      doctorToken,
    });

    return this.consultationRepository.save(consultation);
  }

  // ── Get consultations for a patient ──
  async getMyConsultations(patientId: number) {
    return this.consultationRepository.find({
      where: { patient: { id: patientId } },
      relations: ['doctor'],
      order: { scheduledAt: 'DESC' },
    });
  }

  // ── Get single consultation with room token ──
  async getConsultationRoom(consultationId: number, patientId: number) {
    const consultation = await this.consultationRepository.findOne({
      where: { id: consultationId, patient: { id: patientId } },
      relations: ['doctor'],
    });
    if (!consultation) throw new NotFoundException('Consultation not found');
    return consultation;
  }

  // ── Private: Create Daily.co room ──
  private async createDailyRoom() {
    const response = await axios.post(
      'https://api.daily.co/v1/rooms',
      {
        properties: {
          max_participants: 2,
          enable_chat: true,
          enable_screenshare: false,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24hr expiry
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  }

  // ── Private: Create Daily.co meeting token ──
  private async createDailyToken(roomName: string, role: string) {
    const response = await axios.post(
      'https://api.daily.co/v1/meeting-tokens',
      {
        properties: {
          room_name: roomName,
          is_owner: role === 'doctor',
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.token;
  }

  // ── Seed some doctors (run once) ──
  async seedDoctors() {
    const count = await this.doctorRepository.count();
    if (count > 0) return 'Doctors already seeded';

    const doctors = [
      {
        name: 'Dr. Sarah Johnson',
        specialty: 'General Physician',
        bio: '10+ years experience in general medicine',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      {
        name: 'Dr. James Wilson',
        specialty: 'Cardiologist',
        bio: 'Expert in heart diseases and cardiac care',
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      {
        name: 'Dr. Priya Sharma',
        specialty: 'Dermatologist',
        bio: 'Specialist in skin conditions and treatments',
        avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
      },
      {
        name: 'Dr. Michael Chen',
        specialty: 'Psychiatrist',
        bio: 'Mental health expert with focus on anxiety and depression',
        avatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
      },
    ];

    await this.doctorRepository.save(doctors);
    return 'Doctors seeded successfully';
  }
}
