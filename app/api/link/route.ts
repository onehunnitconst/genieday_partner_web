import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/server/auth";
import {
  getLinkStatus,
  redeemInvite,
  unlinkPartner,
  updatePartnerNickname,
  type RedeemResult,
} from "@/server/partner-link";
import { getCurrentPartner } from "@/server/partner-session";
import type { LinkStatus } from "@/types/link";
import { nicknameSchema } from "@/utils/nickname";
import { partnerCodeSchema } from "@/utils/partner-code";

const linkRequestSchema = z.object({ code: partnerCodeSchema, nickname: nicknameSchema });

const SIGNED_OUT: LinkStatus = { kind: "signed-out" };

const REDEEM_ERRORS: Record<
  Exclude<RedeemResult, { ok: true }>["reason"],
  { message: string; status: number }
> = {
  "invalid-code": {
    message: "코드가 맞지 않거나 만료됐어요. 상대에게 새 코드를 받아 주세요.",
    status: 404,
  },
  self: { message: "내가 만든 코드로는 연결할 수 없어요.", status: 400 },
  "already-linked": { message: "상대가 이미 다른 파트너와 연결되어 있어요.", status: 409 },
  "already-partner": { message: "이미 다른 사람과 연결되어 있어요.", status: 409 },
};

/** 이 기기의 로그인·연결 상태 */
export async function GET(request: NextRequest) {
  const user = await getSessionUser(request.headers);
  return NextResponse.json({ status: user ? await getLinkStatus(user) : SIGNED_OUT });
}

/** 연결 코드를 입력해 로그인한 사용자를 파트너로 연결한다. */
export async function POST(request: NextRequest) {
  const user = await getSessionUser(request.headers);
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요.", status: SIGNED_OUT }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = linkRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력한 내용이 올바르지 않아요." },
      { status: 400 },
    );
  }

  const result = await redeemInvite(user.id, parsed.data.code, parsed.data.nickname);
  if (!result.ok) {
    const { message, status } = REDEEM_ERRORS[result.reason];
    return NextResponse.json({ error: message }, { status });
  }
  return NextResponse.json({ status: result.status });
}

/** 내 이름 바꾸기 */
export async function PATCH(request: NextRequest) {
  const partner = await getCurrentPartner(request.headers);
  if (!partner) {
    return NextResponse.json({ error: "연결이 해제되었어요." }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = nicknameSchema.safeParse((body as { nickname?: unknown } | null)?.nickname);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "이름이 올바르지 않아요." },
      { status: 400 },
    );
  }

  const status = await updatePartnerNickname(partner, parsed.data);
  return NextResponse.json({ status });
}

/** 연결 해제. 로그인은 유지되며, 다른 코드로 다시 연결할 수 있다. */
export async function DELETE(request: NextRequest) {
  const user = await getSessionUser(request.headers);
  if (!user) return NextResponse.json({ status: SIGNED_OUT }, { status: 401 });

  const partner = await getCurrentPartner(request.headers);
  if (partner) await unlinkPartner(partner.id);
  return NextResponse.json({ status: await getLinkStatus(user) });
}
