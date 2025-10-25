// src/prismaClient.ts (or src/prisma/client.ts)

import { PrismaClient } from '@prisma/client';

// Declare a global variable to store the PrismaClient instance.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

// In production, or if no global instance exists, save the new instance to global.
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;