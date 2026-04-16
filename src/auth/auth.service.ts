import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { PasswordResetToken } from './password-reset.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  age?: number | string;
  gender?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(PasswordResetToken)
    private tokenRepository: Repository<PasswordResetToken>,

    private jwtService: JwtService,
  ) {}

  async signUp(userData: SignUpData): Promise<User> {
    const { email, password, name, phone, age, gender } = userData;

    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      phone,
      age: age !== undefined && age !== '' ? Number(age) : null,
      gender,
    });
    return await this.userRepository.save(user);
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // ✅ Added null check for password
    if (!user.password) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, email: user.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return;
    await this.tokenRepository.delete({ user: { id: user.id }, used: false });
    const rawToken: string = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const resetToken = this.tokenRepository.create({
      token: rawToken,
      user,
      expiresAt,
      used: false,
    });
    await this.tokenRepository.save(resetToken);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
    await this.sendResetEmail(user.email, user.name ?? 'User', resetLink);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const record = await this.tokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    if (!record) {
      throw new BadRequestException('Invalid or expired reset link.');
    }
    if (record.used) {
      throw new BadRequestException('This reset link has already been used.');
    }
    if (new Date() > record.expiresAt) {
      throw new BadRequestException(
        'Reset link has expired. Please request a new one.',
      );
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await this.userRepository.update(record.user.id, {
      password: hashedPassword,
    });
    await this.tokenRepository.update(record.id, { used: true });
  }

  private async sendResetEmail(
    toEmail: string,
    userName: string,
    resetLink: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: `"Your App" <${process.env.MAIL_USER ?? ''}>`,
      to: toEmail,
      subject: 'Reset Your Password',
      text: `Hi ${userName},\n\nReset your password:\n${resetLink}\n\nExpires in 30 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#111;">Reset Your Password</h2>
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}"
             style="display:inline-block;padding:12px 28px;background:#111;color:#fff;
                    text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0;">
            Reset Password
          </a>
          <p style="color:#888;font-size:13px;">
            Expires in <strong>30 minutes</strong>.
            Ignore this if you did not request a reset.
          </p>
          <p style="color:#bbb;font-size:11px;">
            Can't click? Copy: <a href="${resetLink}">${resetLink}</a>
          </p>
        </div>
      `,
    });
  }
}
