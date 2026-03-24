import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get()
  async getMedia(@Req() req: any) {
    return this.mediaService.getUserMedia(req.user.id);
  }

  @Post()
  async addMedia(@Req() req: any, @Body() data: any) {
    return this.mediaService.addMedia(req.user.id, data);
  }

  @Delete(':id')
  async deleteMedia(@Req() req: any, @Param('id') id: string) {
    return this.mediaService.deleteMedia(req.user.id, id);
  }
}
