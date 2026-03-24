import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private mailService: MailService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true, mediaItems: true, passkeys: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, ...profileView } = user;
    return profileView;
  }

  async updateProfile(userId: string, data: any) {
    if (data.username) {
      const existing = await this.prisma.user.findFirst({
        where: { username: data.username, id: { not: userId } },
      });
      if (existing) throw new BadRequestException('Username already taken');
      await this.prisma.user.update({
        where: { id: userId },
        data: { username: data.username },
      });
    }

    if (data.preferences) {
      await this.prisma.preferences.upsert({
        where: { userId },
        update: data.preferences,
        create: { userId, ...data.preferences },
      });
    }

    return this.getProfile(userId);
  }

  async deleteAccount(authUserId: string, targetId: string) {
    if (authUserId !== targetId) {
      throw new ForbiddenException('Cannot delete another user');
    }
    await this.prisma.user.delete({ where: { id: targetId } });
    return { message: 'Account deleted' };
  }

  async requestPasswordChange(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    await this.prisma.emailToken.create({
      data: {
        userId,
        type: 'RESET_PASSWORD',
        code: hashedToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await this.mailService.sendPasswordChangeConfirmEmail(user.email, rawToken);

    return { message: 'Password change email sent.' };
  }

  async confirmPasswordChange(userId: string, token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const tokenRecord = await this.prisma.emailToken.findFirst({
      where: {
        userId,
        type: 'RESET_PASSWORD',
        code: hashedToken,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRecord) {
      throw new BadRequestException('Invalid or expired token.');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      this.prisma.emailToken.update({
        where: { id: tokenRecord.id },
        data: { used: true },
      }),
    ]);

    return { message: 'Password changed successfully.' };
  }
}
