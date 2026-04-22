import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('consultation')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  // ── GET /consultation/doctors ──
  // Returns all available doctors (public)
  @Get('doctors')
  getDoctors() {
    return this.consultationService.getDoctors();
  }

  // ── POST /consultation/seed-doctors ──
  // Seeds sample doctors into DB (run once)
  @Post('seed-doctors')
  seedDoctors() {
    return this.consultationService.seedDoctors();
  }

  // ── POST /consultation/book ──
  // Books a consultation (must be logged in)
  @UseGuards(AuthGuard('jwt'))
  @Post('book')
  bookConsultation(
    @Request() req,
    @Body() body: { doctorId: number; scheduledAt: string },
  ) {
    return this.consultationService.bookConsultation(
      req.user.sub, // patient ID from JWT token
      body.doctorId,
      body.scheduledAt,
    );
  }

  // ── GET /consultation/my ──
  // Get logged in patient's consultations
  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  getMyConsultations(@Request() req) {
    return this.consultationService.getMyConsultations(req.user.sub);
  }

  // ── GET /consultation/room/:id ──
  // Get video room details for a consultation
  @UseGuards(AuthGuard('jwt'))
  @Get('room/:id')
  getConsultationRoom(@Param('id') id: string, @Request() req) {
    return this.consultationService.getConsultationRoom(
      parseInt(id),
      req.user.sub,
    );
  }
}
