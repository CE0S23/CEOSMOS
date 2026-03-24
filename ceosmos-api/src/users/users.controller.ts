import { Controller, Get, Patch, Body, UseGuards, Req, Delete, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() data: any) {
    return this.usersService.updateProfile(req.user.id, data);
  }

  @Delete(':id')
  async deleteAccount(@Req() req: any, @Param('id') id: string) {
    return this.usersService.deleteAccount(req.user.id, id);
  }

  @Post('change-password-request')
  async requestPasswordChange(@Req() req: any) {
    return this.usersService.requestPasswordChange(req.user.id);
  }

  @Post('confirm-password-change')
  async confirmPasswordChange(@Req() req: any, @Body() body: any) {
    return this.usersService.confirmPasswordChange(req.user.id, body.token, body.newPassword);
  }
}
