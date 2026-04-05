import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signIn(@Body() dto: any) {
    // For signin, we still just need email and password
    return this.authService.signIn(dto.email, dto.password);
  }

  @Post('/signup')
  signUp(@Body() dto: any) {
    // PASS THE WHOLE DTO HERE! 
    // This matches your new service: signUp(userData: any)
    return this.authService.signUp(dto);
  }
}