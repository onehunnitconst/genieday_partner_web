import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: ".env.local" });

// 테이블과 마이그레이션은 period_check 앱이 관리한다. 이 앱은 prisma generate만 하므로 migrations를 두지 않는다.
const directUrl = new URL(env("DIRECT_URL"));
directUrl.searchParams.set("schema", "period_check");

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: directUrl.toString(),
  },
});
