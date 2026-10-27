import "server-only";

import { getSessionUser } from "./auth";
import { prisma } from "./db";

// 파트너는 Google로 로그인한다. 연결(p_partners)은 로그인한 사용자 ID(partner_user_id)로 찾는다.

/** 로그인한 사용자가 파트너로 연결돼 있으면 그 연결을 돌려준다. */
export async function findPartnerByUserId(partnerUserId: string) {
  return prisma.partner.findUnique({
    where: { partnerUserId },
    select: {
      id: true,
      userId: true,
      nickname: true,
      user: { select: { nickname: true, name: true } },
    },
  });
}

export type CurrentPartner = NonNullable<Awaited<ReturnType<typeof findPartnerByUserId>>>;

/** 요청을 보낸 사용자의 연결. 로그인하지 않았거나 연결돼 있지 않으면 null. */
export async function getCurrentPartner(headers: Headers): Promise<CurrentPartner | null> {
  const user = await getSessionUser(headers);
  return user ? findPartnerByUserId(user.id) : null;
}
