import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdatePreferencesDto, UpdateProfileDto, AdminUpdateUserDto } from './dto/users.dto';
import { IsEnum } from 'class-validator';

class ChangeRoleDto {
  @IsEnum(['USER', 'ADMIN'])
  role!: 'USER' | 'ADMIN';
}

interface RequestWithUser extends Request {
  user: { id: string; role: string };
}

// ── Rutas del usuario autenticado ──────────────────────────
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
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

  // ── Rutas exclusivas de ADMIN ─────────────────────────────

  @Get()
  @Roles('ADMIN')
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id') targetId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.deleteUserById(targetId, req.user.id);
  }

  @Patch(':id/role')
  @Roles('ADMIN')
  async changeRole(
    @Param('id') targetId: string,
    @Body() dto: ChangeRoleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.changeUserRole(targetId, dto.role, req.user.id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  async updateUser(
    @Param('id') targetId: string,
    @Body() dto: AdminUpdateUserDto,
  ) {
    return this.usersService.updateUserById(targetId, dto);
  }
}
