import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
 constructor(
  @InjectRepository(User)
  private userRepository: Repository<User>,
  private jwtService: JwtService,
) {}

  // Updated to accept the new fields from your React Modal
  async signUp(userData: any): Promise<User> {
    const { email, password, name, phone, age, gender } = userData;
    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = this.userRepository.create({ 
      email, 
      password: hashedPassword,
      name,
      phone,
      age: Number(age), // Ensure it's a number for Postgres
      gender 
    });
    
    return await this.userRepository.save(user);
  }

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}