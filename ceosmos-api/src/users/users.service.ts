import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePreferencesDto, UpdateProfileDto, AdminUpdateUserDto } from './dto/users.dto';

type Role = 'USER' | 'ADMIN';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
        _count: {
          select: { mediaItems: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      emailVerified: user.emailVerified,
      role: (user as any).role,
      createdAt: user.createdAt,
      preferences: user.preferences,
      mediaItemsCount: user._count.mediaItems,
    };
  }

  async updatePreferences(userId: string, data: UpdatePreferencesDto) {
    await this.prisma.preferences.upsert({
      where: { userId },
      create: {
        userId,
        theme: data.theme ?? 'dark',
        flowTimeDefault: data.flowTimeDefault ?? 60,
      },
      update: {
        ...(data.theme && { theme: data.theme }),
        ...(data.flowTimeDefault && { flowTimeDefault: data.flowTimeDefault }),
      },
    });

    return this.getProfile(userId);
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    if (data.username) {
      const existing = await this.prisma.user.findFirst({
        where: {
          username: data.username,
          id: { not: userId },
        },
      });
      if (existing) {
        throw new BadRequestException('Username already taken');
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { username: data.username },
      });
    }

    return this.getProfile(userId);
  }

  async getSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        ipAddress: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { message: 'Account deleted successfully' };
  }

  // ── ADMIN METHODS ─────────────────────────────────────────

  async findAllUsers() {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        email: true,
        username: true,
        emailVerified: true,
        role: true,
        createdAt: true,
        _count: { select: { mediaItems: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => ({
      ...u,
      mediaItemsCount: u._count.mediaItems,
      _count: undefined,
    }));
  }

  async deleteUserById(targetId: string, requesterId: string) {
    if (targetId === requesterId) {
      throw new BadRequestException(
        'Admins cannot delete their own account via this endpoint',
      );
    }
    const target = await this.prisma.user.findUnique({
      where: { id: targetId },
    });
    if (!target || target.deletedAt) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id: targetId },
      data: { deletedAt: new Date() },
    });
    return { message: `User ${target.email} deleted successfully` };
  }

  async changeUserRole(targetId: string, role: Role, requesterId: string) {
    if (targetId === requesterId) {
      throw new BadRequestException(
        'Admins cannot change their own role via this endpoint',
      );
    }
    const target = await this.prisma.user.findUnique({
      where: { id: targetId },
    });
    if (!target || target.deletedAt) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: targetId },
      data: { role: role as any },
    });
    return { id: updated.id, email: updated.email, role: (updated as any).role };
  }

  async updateUserById(targetId: string, dto: AdminUpdateUserDto) {
    const target = await this.prisma.user.findUnique({
      where: { id: targetId },
    });
    if (!target || target.deletedAt) throw new NotFoundException('User not found');

    if (dto.email) {
      const existing = await this.prisma.user.findFirst({
        where: { email: dto.email, id: { not: targetId } },
      });
      if (existing) throw new BadRequestException('Email already in use');
    }

    if (dto.username) {
      const existing = await this.prisma.user.findFirst({
        where: { username: dto.username, id: { not: targetId } },
      });
      if (existing) throw new BadRequestException('Username already taken');
    }

    const data: any = {};
    if (dto.email) { data.email = dto.email; data.emailVerified = false; }
    if (dto.username) data.username = dto.username;

    const updated = await this.prisma.user.update({
      where: { id: targetId },
      data,
    });
    return {
      id: updated.id,
      email: updated.email,
      username: updated.username,
      role: (updated as any).role,
    };
  }
}
