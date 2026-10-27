import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/** ddu_be와 같은 DB 안에서 이 앱의 테이블이 있는 스키마 (prisma.config.ts와 맞춘다) */
const DB_SCHEMA = "period_check";

function createPrismaClient() {
  const adapter = new PrismaPg(
    { connectionString: process.env.DATABASE_URL },
    { schema: DB_SCHEMA },
  );
  return new PrismaClient({ adapter });
}

// 개발 중 HMR로 모듈이 다시 로드될 때마다 커넥션이 쌓이지 않도록 전역에 재사용한다
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
