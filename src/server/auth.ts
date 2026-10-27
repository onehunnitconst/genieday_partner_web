import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./db";

// 지니데이(period_check)와 같은 회원 테이블(p_users)·Google 클라이언트를 쓴다. 한 Google 계정으로 두 앱을 모두 쓸 수 있다.
// Google 콘솔에 등록한 리디렉션 URI: {BETTER_AUTH_URL}/api/auth/callback/google
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  user: {
    additionalFields: {
      // 지니데이의 닉네임. 파트너 앱에서는 바꾸지 않고 연결할 때 이름 제안으로만 읽는다
      nickname: { type: "string", required: false, input: false },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
  },
  advanced: {
    // 로컬에서는 두 앱이 같은 localhost(포트만 다름)라 쿠키를 같이 본다. 로그인·로그아웃이 섞이지 않게 이름을 나눈다
    cookiePrefix: "genieday-partner",
  },
  plugins: [nextCookies()],
});

/** 요청 헤더의 세션 쿠키로 로그인한 사용자를 찾는다. 로그인하지 않았으면 null. */
export async function getSessionUser(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  return session?.user ?? null;
}
