import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async getUserMedia(userId: string) {
    return this.prisma.mediaItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addMedia(userId: string, data: any) {
    return this.prisma.mediaItem.create({
      data: {
        userId,
        type: data.type,
        externalId: data.externalId,
        url: data.url,
        title: data.title,
        thumbnail: data.thumbnail,
      },
    });
  }

  async deleteMedia(authUserId: string, mediaId: string) {
    const item = await this.prisma.mediaItem.findUnique({ where: { id: mediaId } });
    if (!item || item.userId !== authUserId) {
      throw new ForbiddenException('Cannot delete this media item');
    }
    await this.prisma.mediaItem.delete({ where: { id: mediaId } });
    return { message: 'Media deleted' };
  }
}
