import { NextResponse, type NextRequest } from "next/server";
import { getCurrentPartner } from "@/server/partner-session";
import { listPeriodRecords } from "@/server/period-records";

/** 연결된 상대의 생리 기록 (읽기 전용) */
export async function GET(request: NextRequest) {
  const partner = await getCurrentPartner(request.headers);
  if (!partner) {
    return NextResponse.json({ error: "연결이 해제되었어요." }, { status: 401 });
  }

  return NextResponse.json({ records: await listPeriodRecords(partner.userId) });
}
