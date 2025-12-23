import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import type { AuthRequest } from 'src/types/auth-request';
import { SupabaseGuard } from './supabase.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // loging
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // perfil protegido requiere token
  @UseGuards(SupabaseGuard)
  @Get('profile')
  getProfile(@Req() req: AuthRequest) {
    return req.user;
  }
}
