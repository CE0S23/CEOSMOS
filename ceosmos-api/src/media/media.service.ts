import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto, GetMediaQueryDto } from './dto/media.dto';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserMedia(userId: string, query: GetMediaQueryDto) {
    return this.prisma.mediaItem.findMany({
      where: {
        userId,
        ...(query.type && { type: query.type }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addMedia(userId: string, data: CreateMediaDto) {
    const totalItems = await this.prisma.mediaItem.count({
      where: { userId },
    });

    if (totalItems >= 100) {
      throw new BadRequestException('Maximum limit of 100 media items reached');
    }

    if (data.type === 'YOUTUBE') {
      const existing = await this.prisma.mediaItem.findFirst({
        where: { userId, externalId: data.externalId },
      });
      if (existing) {
        throw new BadRequestException('This YouTube video is already saved');
      }
    } else if (data.type === 'IMAGE') {
      const existing = await this.prisma.mediaItem.findFirst({
        where: { userId, url: data.url },
      });
      if (existing) {
        throw new BadRequestException('This image URL is already saved');
      }
    }

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

  async deleteMedia(userId: string, mediaId: string) {
    const item = await this.prisma.mediaItem.findUnique({
      where: { id: mediaId },
    });
    
    if (!item) {
      throw new NotFoundException('Media item not found');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('Cannot delete a media item that does not belong to you');
    }

    await this.prisma.mediaItem.delete({
      where: { id: mediaId },
    });

    return { message: 'Media item deleted successfully' };
  }
}
