"use client";

import { useEffect, useState } from "react";
import { refreshLinkStatus } from "@/features/link/hooks/use-link-status";
import type { PeriodRecord } from "@/types/period";

// 연결된 상대의 기록을 읽기만 한다. (기록은 상대의 period_check 앱에서만 바뀐다)

const ENDPOINT = "/api/period-records";

class UnlinkedError extends Error {}

const fetchRecords = async (): Promise<PeriodRecord[]> => {
  const response = await fetch(ENDPOINT, { cache: "no-store" });
  if (response.status === 401) throw new UnlinkedError();
  if (!response.ok) throw new Error(`기록을 불러오지 못했습니다. (${response.status})`);
  const body = (await response.json()) as { records: PeriodRecord[] };
  return body.records;
};

/** 상대의 생리 기록. 불러오기 전(과 서버 렌더링 중)에는 null이다. */
export function usePeriodRecords(): PeriodRecord[] | null {
  const [records, setRecords] = useState<PeriodRecord[] | null>(null);

  useEffect(() => {
    let ignore = false;

    const load = () =>
      fetchRecords().then(
        (next) => {
          if (!ignore) setRecords(next);
        },
        (error: unknown) => {
          if (ignore) return;
          // 상대가 연결을 해제했다 → 게이트가 연결 화면으로 바꾼다.
          if (error instanceof UnlinkedError) {
            void refreshLinkStatus();
            return;
          }
          console.error(error);
          setRecords((previous) => previous ?? []);
        },
      );

    // 앱을 다시 열면(화면이 다시 보이면) 그사이 상대가 남긴 기록을 불러온다.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void load();
    };

    void load();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      ignore = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return records;
}
