import "server-only";

import type { IsoDate, PeriodRecord } from "@/types/period";
import { prisma } from "./db";

// 파트너는 기록을 읽기만 한다. 쓰기는 period_check 앱에서만 한다.

// DATE 컬럼은 UTC 자정의 Date로 오가므로 UTC 기준으로 변환해야 날짜가 밀리지 않는다
const toIsoDate = (date: Date): IsoDate => date.toISOString().slice(0, 10);

export async function listPeriodRecords(userId: string): Promise<PeriodRecord[]> {
  const rows = await prisma.periodRecord.findMany({
    where: { userId },
    orderBy: { startDate: "asc" },
    select: { id: true, startDate: true, endDate: true },
  });
  return rows.map((row) => ({
    id: row.id,
    startDate: toIsoDate(row.startDate),
    endDate: toIsoDate(row.endDate),
  }));
}
