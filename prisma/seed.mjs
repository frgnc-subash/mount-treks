import "dotenv/config";
import { randomBytes, scryptSync } from "node:crypto";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function main() {
  const adminEmail = getRequiredEnv("ADMIN_EMAIL");
  const adminPassword = getRequiredEnv("ADMIN_PASSWORD");
  const adminName = getRequiredEnv("ADMIN_NAME");

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail.toLowerCase() },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        fullName: adminName,
        email: adminEmail.toLowerCase(),
        passwordHash: hashPassword(adminPassword),
        role: UserRole.ADMIN,
      },
    });
    console.log(`Admin user created: ${adminEmail}`);
    return;
  }

  console.log(`Admin user already exists: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
