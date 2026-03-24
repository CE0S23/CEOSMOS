import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  // @ts-ignore
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL?.replace('.apirest.c-6.', '.'),
  },
});
