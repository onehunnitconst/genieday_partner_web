import { addDays, differenceInCalendarDays, subDays } from "date-fns";
import type { IsoDate, PeriodRecord } from "@/types/period";
import {
  CYCLE_SAMPLE_SIZE,
  DEFAULT_CYCLE_LENGTH,
  FERTILE_DAYS_AFTER_OVULATION,
  FERTILE_DAYS_BEFORE_OVULATION,
  LUTEAL_PHASE_LENGTH,
  MAX_CYCLE_LENGTH,
  MIN_CYCLE_LENGTH,
  PREDICTED_CYCLE_COUNT,
} from "../constants";
import { fromIsoDate, toIsoDate } from "./date";
import { getPeriodLength, sortRecords } from "./period-records";

export type DateRange = { start: IsoDate; end: IsoDate };

export type FertileWindow = DateRange & { ovulation: IsoDate };

export type CyclePrediction = {
  averageCycleLength: number;
  averagePeriodLength: number;
  /** 평균 주기 계산에 쓴 주기 수. 0이면 기본 주기로 예측한 것. */
  cycleSampleCount: number;
  /** 마지막 기록 기준 원래 예정일. */
  expectedStart: IsoDate;
  /** 예정일이 지났는데 새 기록이 없으면 지난 일수, 아니면 0. */
  lateDays: number;
  periods: DateRange[];
  fertileWindows: FertileWindow[];
};

const average = (values: number[]) =>
  Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);

const daysBetween = (from: IsoDate, to: IsoDate) =>
  differenceInCalendarDays(fromIsoDate(to), fromIsoDate(from));

const shift = (date: IsoDate, days: number) =>
  toIsoDate(addDays(fromIsoDate(date), days));

export const isInRange = (date: IsoDate, range: DateRange) =>
  range.start <= date && date <= range.end;

/** 최근 기록으로 평균 주기를 구해 앞으로의 생리일·가임기를 추정한다. */
export function predictCycles(
  records: PeriodRecord[],
  today: IsoDate,
): CyclePrediction | null {
  const sorted = sortRecords(records);
  const last = sorted.at(-1);
  if (!last) return null;

  const recent = sorted.slice(-(CYCLE_SAMPLE_SIZE + 1));
  const cycleLengths = recent
    .slice(1)
    .map((record, i) => daysBetween(recent[i].startDate, record.startDate))
    .filter((days) => days >= MIN_CYCLE_LENGTH && days <= MAX_CYCLE_LENGTH);

  const averageCycleLength = cycleLengths.length
    ? average(cycleLengths)
    : DEFAULT_CYCLE_LENGTH;
  const averagePeriodLength = average(
    sorted.slice(-CYCLE_SAMPLE_SIZE).map(getPeriodLength),
  );

  const expectedStart = shift(last.startDate, averageCycleLength);
  const lateDays = Math.max(0, daysBetween(expectedStart, today));
  // 늦어지는 중이면 오늘부터 시작한다고 보고 이후 주기를 다시 잡는다.
  const firstStart = lateDays > 0 ? today : expectedStart;

  const periods: DateRange[] = [];
  const fertileWindows: FertileWindow[] = [];

  for (let k = 0; k < PREDICTED_CYCLE_COUNT; k++) {
    const start = shift(firstStart, k * averageCycleLength);
    periods.push({ start, end: shift(start, averagePeriodLength - 1) });

    // 늦어진 주기의 배란일은 이미 지나 의미가 없다.
    if (k === 0 && lateDays > 0) continue;

    const ovulation = toIsoDate(subDays(fromIsoDate(start), LUTEAL_PHASE_LENGTH));
    const windowStart = shift(ovulation, -FERTILE_DAYS_BEFORE_OVULATION);
    const windowEnd = shift(ovulation, FERTILE_DAYS_AFTER_OVULATION);
    // 주기가 짧아 직전 생리와 겹치는 부분은 잘라낸다.
    const previousEnd = k === 0 ? last.endDate : periods[k - 1].end;
    if (windowEnd <= previousEnd) continue;
    fertileWindows.push({
      start: windowStart > previousEnd ? windowStart : shift(previousEnd, 1),
      end: windowEnd,
      ovulation,
    });
  }

  return {
    averageCycleLength,
    averagePeriodLength,
    cycleSampleCount: cycleLengths.length,
    expectedStart,
    lateDays,
    periods,
    fertileWindows,
  };
}
