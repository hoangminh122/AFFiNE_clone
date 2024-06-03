import { PrismaClient } from '@prisma/client';

import { refreshPrompts } from './utils/prompts';

export class UpdatePrompts1714021969665 {
  // do the migration
  static async up(db: PrismaClient) {
    await refreshPrompts(db);
  }

  // revert the migration
  static async down(_db: PrismaClient) {}
}
