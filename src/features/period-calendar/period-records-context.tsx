"use client";

import { createContext, use, type ReactNode } from "react";
import type { PeriodRecord } from "@/types/period";
import { usePeriodRecords } from "./hooks/use-period-records";

// undefined: Provider 밖, null: 아직 불러오는 중
const PeriodRecordsContext = createContext<PeriodRecord[] | null | undefined>(undefined);

/** 탭을 오갈 때마다 기록을 다시 불러오지 않도록 탭 레이아웃에서 한 번만 불러와 나눠 쓴다. */
export function PeriodRecordsProvider({ children }: { children: ReactNode }) {
  const records = usePeriodRecords();
  return <PeriodRecordsContext value={records}>{children}</PeriodRecordsContext>;
}

/** 상대의 생리 기록. 불러오기 전(과 서버 렌더링 중)에는 null이다. */
export function useSharedPeriodRecords(): PeriodRecord[] | null {
  const records = use(PeriodRecordsContext);
  if (records === undefined) {
    throw new Error("useSharedPeriodRecords는 PeriodRecordsProvider 안에서만 쓸 수 있습니다.");
  }
  return records;
}
