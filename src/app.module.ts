import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity'; // We will create this next

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // default username
      password: 'your_password', 
      database: 'aegis_db',
      entities: [User],
      synchronize: true, // This automatically creates the table in pgAdmin
    }),
    AuthModule,
  ],
})
export class AppModule {}


















// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
// import { PrismaService } from './prisma/prisma.service';
// import { AuthModule } from './auth/auth.module';

// @Module({
//   imports: [AuthModule],
//   controllers: [AppController],
//   providers: [AppService, PrismaService],
// })
// export class AppModule {}
