import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { PasswordResetToken } from './auth/password-reset.entity'; // ✅ Added

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Loads .env globally

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'BubsProject2026'), // ✅ From .env
        database: config.get<string>('DB_DATABASE', 'aegis_db'),
        entities: [User, PasswordResetToken], // ✅ Added PasswordResetToken
        synchronize: true,
      }),
    }),

    AuthModule,
  ],
})
export class AppModule {}
