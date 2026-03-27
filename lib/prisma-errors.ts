import { Prisma } from "@prisma/client";

type FriendlyPrismaError = {
  status: number;
  message: string;
};

function isMissingTableError(error: Prisma.PrismaClientKnownRequestError) {
  return error.code === "P2021";
}

function isMissingColumnError(error: Prisma.PrismaClientKnownRequestError) {
  return error.code === "P2022";
}

function isConnectionError(error: Prisma.PrismaClientInitializationError) {
  return typeof error.errorCode === "string" && error.errorCode.startsWith("P1");
}

function isMissingDatabaseUrlError(error: Prisma.PrismaClientInitializationError) {
  return error.message.includes("Environment variable not found: DATABASE_URL");
}

export function getPrismaAuthFriendlyError(error: unknown): FriendlyPrismaError | null {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    if (isMissingDatabaseUrlError(error)) {
      return {
        status: 503,
        message:
          "Database is not configured on the server. Set DATABASE_URL (or Vercel POSTGRES_PRISMA_URL) and redeploy.",
      };
    }

    const message = isConnectionError(error)
      ? "Database connection failed. Check DATABASE_URL and ensure Postgres is running."
      : "Database initialization failed. Check your DATABASE_URL and Prisma setup.";
    return { status: 503, message };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (isMissingTableError(error) || isMissingColumnError(error)) {
      return {
        status: 503,
        message:
          "Database schema is missing. Run Prisma migrations and try again.",
      };
    }
  }

  return null;
}
