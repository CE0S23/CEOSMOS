import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePreferencesDto, UpdateProfileDto } from './dto/users.dto';

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

  async deleteAccount(userId: string) {
    // Prisma cascade drops passkeys, sessions, emailTokens, mediaItems and preferences.
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { message: 'Account deleted successfully' };
  }
}
