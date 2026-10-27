import { addDays, differenceInCalendarDays } from "date-fns";
import {
  FERTILE_DAYS_AFTER_OVULATION,
  FERTILE_DAYS_BEFORE_OVULATION,
  LUTEAL_PHASE_LENGTH,
} from "@/features/period-calendar/constants";
import {
  isInRange,
  type CyclePrediction,
  type DateRange,
} from "@/features/period-calendar/utils/cycle-prediction";
import { fromIsoDate, toIsoDate } from "@/features/period-calendar/utils/date";
import {
  findRecordContaining,
  sortRecords,
} from "@/features/period-calendar/utils/period-records";
import type { IsoDate, PeriodRecord } from "@/types/period";
import { PMS_DAYS } from "../constants";

/** 주기를 하루에 빗댄 시간대. 밤=생리, 낮=평온한 시기, 정오=가임기, 저녁=PMS */
export type DayPhase = "night" | "day" | "noon" | "evening";

export type PhaseSegment = {
  phase: DayPhase;
  /** 주기 안에서 이 구간이 시작하는 날의 순번 (0부터) */
  startIndex: number;
  days: number;
};

export type CycleTimeline = {
  /** 이번 주기 첫날 (가장 최근 생리 시작일) */
  cycleStart: IsoDate;
  /** 이번 주기 마지막 날. 예정일이 지났으면 오늘까지 늘어난다. */
  cycleEnd: IsoDate;
  segments: PhaseSegment[];
  /** 주기 안에서 오늘의 순번 (0부터) */
  todayIndex: number;
  /** 지금 구간 */
  current: PhaseSegment;
  /** 정오(가임기)를 지났는지. 같은 낮이라도 아침(난포기)과 오후(황체기)를 나눈다. */
  isAfterNoon: boolean;
  isOvulationDay: boolean;
};

const shift = (date: IsoDate, days: number) =>
  toIsoDate(addDays(fromIsoDate(date), days));

const daysBetween = (from: IsoDate, to: IsoDate) =>
  differenceInCalendarDays(fromIsoDate(to), fromIsoDate(from));

/**
 * 이번 주기의 배란일과 가임기. 예측(prediction.fertileWindows)은 예정일이 지나면
 * 이번 주기의 가임기를 지우므로, 원래 예정일 기준으로 직접 잡는다.
 */
const getCurrentFertileWindow = (prediction: CyclePrediction) => {
  const ovulation = shift(prediction.expectedStart, -LUTEAL_PHASE_LENGTH);
  return {
    start: shift(ovulation, -FERTILE_DAYS_BEFORE_OVULATION),
    end: shift(ovulation, FERTILE_DAYS_AFTER_OVULATION),
    ovulation,
  };
};

/** 하루를 시간대로 나눈다. 기록된 생리가 가장 우선이고, 그다음 가임기, PMS 순이다. */
const classifyDay = (
  date: IsoDate,
  records: PeriodRecord[],
  fertileWindow: DateRange,
  pmsStart: IsoDate,
): DayPhase => {
  if (findRecordContaining(records, date)) return "night";
  if (isInRange(date, fertileWindow)) return "noon";
  // 예정일이 지나도록 생리가 없으면 그날들도 저녁(PMS)으로 본다.
  if (date >= pmsStart) return "evening";
  return "day";
};

/** 오늘이 이번 주기의 어디쯤인지 시간대별 구간으로 나눠 돌려준다. 기록이 없으면 null. */
export function buildCycleTimeline(
  records: PeriodRecord[],
  prediction: CyclePrediction,
  today: IsoDate,
): CycleTimeline | null {
  const last = sortRecords(records)
    .filter((r) => r.startDate <= today)
    .at(-1);
  if (!last) return null;

  const cycleStart = last.startDate;
  const plannedEnd = shift(prediction.expectedStart, -1);
  const cycleEnd = plannedEnd > today ? plannedEnd : today;
  const totalDays = daysBetween(cycleStart, cycleEnd) + 1;

  const fertileWindow = getCurrentFertileWindow(prediction);
  const pmsStart = shift(prediction.expectedStart, -PMS_DAYS);

  const segments: PhaseSegment[] = [];
  for (let i = 0; i < totalDays; i++) {
    const phase = classifyDay(shift(cycleStart, i), records, fertileWindow, pmsStart);
    const tail = segments.at(-1);
    if (tail?.phase === phase) tail.days += 1;
    else segments.push({ phase, startIndex: i, days: 1 });
  }

  const todayIndex = daysBetween(cycleStart, today);
  const current = segments.findLast((s) => s.startIndex <= todayIndex)!;

  return {
    cycleStart,
    cycleEnd,
    segments,
    todayIndex,
    current,
    isAfterNoon: segments.some(
      (s) => s.phase === "noon" && s.startIndex < current.startIndex,
    ),
    isOvulationDay: current.phase === "noon" && fertileWindow.ovulation === today,
  };
}

/** 지금 구간 다음에 오는 구간과 그때까지 남은 일수. 예정일이 지나 늦어지는 중이면 null. */
export function findNextPhase(
  timeline: CycleTimeline,
  prediction: CyclePrediction,
): { phase: DayPhase; daysUntil: number } | null {
  const next = timeline.segments.find((s) => s.startIndex > timeline.todayIndex);
  if (next) return { phase: next.phase, daysUntil: next.startIndex - timeline.todayIndex };
  if (prediction.lateDays > 0) return null;
  // 마지막 구간이면 다음은 예정된 생리(밤)다. 오늘이 예정일이면 0일 남았다.
  const today = shift(timeline.cycleStart, timeline.todayIndex);
  return { phase: "night", daysUntil: daysBetween(today, prediction.expectedStart) };
}

/**
 * 하늘 위 해(또는 달)의 위치. 0°는 오른쪽 지평선, 180°는 왼쪽 지평선이다.
 * 아침 → 정오 → 오후 → 저녁으로 해가 지고, 밤에는 달이 하늘을 가로지른다.
 */
export function getCelestialAngle(timeline: CycleTimeline): number {
  const { current, todayIndex, isAfterNoon } = timeline;
  const progress = (todayIndex - current.startIndex + 0.5) / current.days;
  const [from, to] = {
    night: [155, 25],
    day: isAfterNoon ? [80, 40] : [160, 100],
    noon: [100, 80],
    evening: [40, 8],
  }[current.phase];
  return from + (to - from) * progress;
}
