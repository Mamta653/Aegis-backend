import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { PasswordResetToken } from './auth/password-reset.entity';
import { ConsultationModule } from './consultation/consultation.module';
import { Consultation } from './consultation/consultation.entity';
import { Doctor } from './consultation/doctor.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'BubsProject2026'),
        database: config.get<string>('DB_DATABASE', 'aegis_db'),
        entities: [User, PasswordResetToken, Consultation, Doctor], // ✅ Added
        synchronize: true,
      }),
    }),

    AuthModule,
    ConsultationModule, // ✅ Added
  ],
})
export class AppModule {}
