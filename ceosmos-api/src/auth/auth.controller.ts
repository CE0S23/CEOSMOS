import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const session = await this.authService.login(dto);
    res.cookie('Authentication', session.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { success: true };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    await this.authService.logout(req.user.id);
    res.clearCookie('Authentication');
    return { success: true };
  }

  @Post('webauthn/register/generate-options')
  async webAuthnRegisterOptions(@Body('email') email: string) {
    return this.authService.generateWebAuthnRegisterOptions(email);
  }

  @Post('webauthn/register/verify')
  async webAuthnRegisterVerify(
    @Body('email') email: string,
    @Body('response') response: any,
    @Body('challenge') challenge: string,
  ) {
    return this.authService.verifyWebAuthnRegister(email, response, challenge);
  }

  @Post('webauthn/login/generate-options')
  async webAuthnLoginOptions(@Body('email') email: string) {
    return this.authService.generateWebAuthnLoginOptions(email);
  }

  @Post('webauthn/login/verify')
  async webAuthnLoginVerify(
    @Body('email') email: string,
    @Body('response') response: any,
    @Body('challenge') challenge: string,
    @Res({ passthrough: true }) res: any,
  ) {
    const result = await this.authService.verifyWebAuthnLogin(email, response, challenge);
    if ((result as any).accessToken) {
      res.cookie('Authentication', (result as any).accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return { success: true };
    }
    return { success: false };
  }
}
