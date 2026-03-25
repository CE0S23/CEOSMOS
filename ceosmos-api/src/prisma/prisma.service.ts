import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const rawUrl = process.env.DATABASE_URL;
    if (!rawUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const connectionString = rawUrl.replace('.apirest.c-6.', '.');
    const adapter = new PrismaNeon({ connectionString });

    super({ adapter } as any);
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected to Neon PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
