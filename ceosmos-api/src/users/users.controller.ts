import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdatePreferencesDto, UpdateProfileDto } from './dto/users.dto';

interface RequestWithUser extends Request {
  user: { id: string };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('preferences')
  async updatePreferences(
    @Req() req: RequestWithUser,
    @Body() data: UpdatePreferencesDto,
  ) {
    return this.usersService.updatePreferences(req.user.id, data);
  }

  @Patch('profile')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() data: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, data);
  }

  @Delete('me')
  async deleteAccount(@Req() req: RequestWithUser) {
    return this.usersService.deleteAccount(req.user.id);
  }
}
