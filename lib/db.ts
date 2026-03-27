import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function resolveDatabaseUrl() {
  const directDatabaseUrl = process.env.DATABASE_URL?.trim();
  if (directDatabaseUrl) {
    return directDatabaseUrl;
  }

  const vercelPostgresUrl =
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim() ||
    process.env.POSTGRES_URL?.trim();

  if (vercelPostgresUrl) {
    process.env.DATABASE_URL = vercelPostgresUrl;
    return vercelPostgresUrl;
  }

  return "";
}

resolveDatabaseUrl();

export const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
