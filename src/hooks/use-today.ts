"use client";

import { useSyncExternalStore } from "react";
import { format } from "date-fns";
import type { IsoDate } from "@/types/period";

const subscribe = () => () => {};
const getSnapshot = (): IsoDate => format(new Date(), "yyyy-MM-dd");
const getServerSnapshot = () => null;

/**
 * 사용자 기기 기준 오늘 날짜. 서버 프리렌더 중에는 null을 반환해
 * 빌드 시점의 날짜가 화면에 박히지 않게 한다.
 */
export function useToday(): IsoDate | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
