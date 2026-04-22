import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationController } from './consultation.controller';
import { ConsultationService } from './consultation.service';
import { Consultation } from './consultation.entity';
import { Doctor } from './doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consultation, Doctor])],
  controllers: [ConsultationController],
  providers: [ConsultationService],
})
export class ConsultationModule {}
