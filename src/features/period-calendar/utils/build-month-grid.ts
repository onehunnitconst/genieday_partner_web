import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { IsoDate, PeriodRecord } from "@/types/period";
import { isInRange, type CyclePrediction, type DateRange } from "./cycle-prediction";
import { toIsoDate } from "./date";

/** 날짜에 칠하는 띠. 우선순위: 실제 생리 > 생리 예정 > 가임기 */
export type DayBand = "period" | "predicted-period" | "fertile";

export type CalendarDay = {
  date: IsoDate;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  band: DayBand | null;
  isBandStart: boolean;
  isBandEnd: boolean;
  isOvulation: boolean;
};

type BuildMonthGridParams = {
  month: Date;
  records: PeriodRecord[];
  prediction: CyclePrediction | null;
  today: IsoDate;
  selectedDate: IsoDate;
};

const findBand = (
  date: IsoDate,
  records: PeriodRecord[],
  prediction: CyclePrediction | null,
): { band: DayBand; range: DateRange } | null => {
  const record = records.find((r) => isInRange(date, { start: r.startDate, end: r.endDate }));
  if (record) return { band: "period", range: { start: record.startDate, end: record.endDate } };

  const predicted = prediction?.periods.find((range) => isInRange(date, range));
  if (predicted) return { band: "predicted-period", range: predicted };

  const fertile = prediction?.fertileWindows.find((range) => isInRange(date, range));
  if (fertile) return { band: "fertile", range: fertile };

  return null;
};

/** 월 달력을 일요일 시작 주 단위(7일씩) 배열로 만든다. */
export function buildMonthGrid({
  month,
  records,
  prediction,
  today,
  selectedDate,
}: BuildMonthGridParams): CalendarDay[][] {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  const cells = days.map((day): CalendarDay => {
    const date = toIsoDate(day);
    const found = findBand(date, records, prediction);
    return {
      date,
      dayOfMonth: day.getDate(),
      isCurrentMonth: isSameMonth(day, month),
      isToday: date === today,
      isSelected: date === selectedDate,
      band: found?.band ?? null,
      isBandStart: found?.range.start === date,
      isBandEnd: found?.range.end === date,
      isOvulation:
        found?.band === "fertile" &&
        Boolean(prediction?.fertileWindows.some((w) => w.ovulation === date)),
    };
  });

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
