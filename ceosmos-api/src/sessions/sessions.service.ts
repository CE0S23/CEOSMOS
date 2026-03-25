import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createHash, randomBytes } from 'crypto';
import type { Request } from 'express';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(userId: string, req: Request): Promise<string> {
    await this.prisma.session.deleteMany({ where: { userId } });

    const rawToken = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(rawToken).digest('hex');

    await this.prisma.session.create({
      data: {
        userId,
        token: hashedToken,
        userAgent: req.headers['user-agent'] ?? null,
        ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ?? req.ip ?? null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return rawToken;
  }

  async validateSession(sessionId: string): Promise<boolean> {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) return false;
    if (session.expiresAt < new Date()) {
      await this.prisma.session.delete({ where: { id: sessionId } });
      return false;
    }
    return true;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { userId } });
  }
}
