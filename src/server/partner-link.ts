import "server-only";

import { Prisma } from "@/generated/prisma/client";
import type { LinkStatus } from "@/types/link";
import { prisma } from "./db";
import { findPartnerByUserId, type CurrentPartner } from "./partner-session";

export const toLinkStatus = (partner: CurrentPartner): LinkStatus => ({
  kind: "linked",
  nickname: partner.nickname,
  // 닉네임을 정해야 코드를 만들 수 있으므로 보통 비어 있지 않다.
  ownerNickname: partner.user.nickname ?? partner.user.name,
});

/** 로그인한 사용자의 연결 상태 */
export async function getLinkStatus(user: { id: string; nickname?: string | null }): Promise<LinkStatus> {
  const partner = await findPartnerByUserId(user.id);
  return partner
    ? toLinkStatus(partner)
    : { kind: "unlinked", suggestedNickname: user.nickname ?? null };
}

export type RedeemResult =
  | { ok: true; status: LinkStatus }
  | { ok: false; reason: "invalid-code" | "self" | "already-linked" | "already-partner" };

/**
 * 연결 코드를 쓰고 로그인한 사용자를 코드 주인의 파트너로 연결한다. 코드는 한 번 쓰면 사라진다.
 * - invalid-code: 코드가 없거나 만료됨
 * - self: 내가 만든 코드
 * - already-linked: 코드 주인에게 이미 파트너가 있음
 * - already-partner: 나는 이미 다른 사람과 연결돼 있음
 */
export async function redeemInvite(
  partnerUserId: string,
  code: string,
  nickname: string,
): Promise<RedeemResult> {
  try {
    return await prisma.$transaction(async (tx) => {
      const now = new Date();
      const invite = await tx.partnerInvite.findUnique({
        where: { code },
        select: { userId: true, expiresAt: true },
      });
      if (!invite || invite.expiresAt <= now) return { ok: false, reason: "invalid-code" };
      // 코드를 지우기 전에 막아야 내 코드가 헛되이 사라지지 않는다.
      if (invite.userId === partnerUserId) return { ok: false, reason: "self" };

      // 같은 코드를 동시에 입력해도 한 쪽만 지울 수 있다. 지우지 못한 쪽은 이미 쓰인 코드로 본다.
      const claimed = await tx.partnerInvite.deleteMany({
        where: { code, expiresAt: { gt: now } },
      });
      if (claimed.count === 0) return { ok: false, reason: "invalid-code" };

      // 연결은 양쪽 모두 한 명씩(user_id, partner_user_id UNIQUE). 겹치면 P2002로 트랜잭션째 되돌려 코드도 살아남는다.
      const partner = await tx.partner.create({
        data: { userId: invite.userId, partnerUserId, nickname },
        select: {
          id: true,
          userId: true,
          nickname: true,
          user: { select: { nickname: true, name: true } },
        },
      });
      return { ok: true, status: toLinkStatus(partner) };
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      // 어느 쪽 UNIQUE에 걸렸는지로 이유를 나눈다.
      const alreadyPartner = await findPartnerByUserId(partnerUserId);
      return { ok: false, reason: alreadyPartner ? "already-partner" : "already-linked" };
    }
    throw error;
  }
}

/** 내 이름(상대 앱에 보이는 이름)을 바꾼다. */
export async function updatePartnerNickname(partner: CurrentPartner, nickname: string) {
  await prisma.partner.update({ where: { id: partner.id }, data: { nickname } });
  return toLinkStatus({ ...partner, nickname });
}

/** 연결을 해제한다. 상대 앱에서도 바로 "연결 안 됨"으로 보인다. 내 계정(로그인)은 그대로 남는다. */
export async function unlinkPartner(partnerId: string) {
  await prisma.partner.deleteMany({ where: { id: partnerId } });
}
