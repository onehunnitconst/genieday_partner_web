"use client";

import { useMemo, useState } from "react";
import { addMonths, differenceInCalendarDays, startOfMonth } from "date-fns";
import { useToday } from "@/hooks/use-today";
import type { IsoDate, PeriodRecord } from "@/types/period";
import { HISTORY_LIMIT } from "./constants";
import { useSharedPeriodRecords } from "./period-records-context";
import { buildMonthGrid } from "./utils/build-month-grid";
import {
  isInRange,
  predictCycles,
  type CyclePrediction,
} from "./utils/cycle-prediction";
import {
  formatDayLabel,
  formatMonthLabel,
  formatShortDate,
  fromIsoDate,
} from "./utils/date";
import { findRecordContaining, getPeriodLength } from "./utils/period-records";

export type SelectedDayStatus =
  | { kind: "future" }
  | { kind: "in-period"; dayNumber: number; periodLength: number }
  | { kind: "none" };

export type PeriodHistoryItem = {
  id: string;
  startDate: IsoDate;
  rangeLabel: string;
  lengthLabel: string;
};

export type CycleSummary = {
  headline: string;
  isLate: boolean;
  nextPeriodLabel: string;
  fertileLabel: string | null;
  ovulationLabel: string | null;
  averagesLabel: string;
  basisLabel: string;
};

const buildCycleSummary = (
  prediction: CyclePrediction,
  records: PeriodRecord[],
  today: IsoDate,
): CycleSummary => {
  const ongoing = findRecordContaining(records, today);
  const daysUntil = differenceInCalendarDays(
    fromIsoDate(prediction.expectedStart),
    fromIsoDate(today),
  );

  let headline: string;
  if (ongoing) {
    headline = `생리 ${getPeriodLength({ ...ongoing, endDate: today })}일차예요`;
  } else if (prediction.lateDays > 0) {
    headline = `예정일보다 ${prediction.lateDays}일 늦어지고 있어요`;
  } else if (daysUntil === 0) {
    headline = "오늘이 생리 예정일이에요";
  } else {
    headline = `다음 생리까지 ${daysUntil}일`;
  }

  const fertile = prediction.fertileWindows.find((w) => w.end >= today);

  return {
    headline,
    isLate: !ongoing && prediction.lateDays > 0,
    nextPeriodLabel:
      prediction.lateDays > 0
        ? `${formatDayLabel(prediction.expectedStart)} 예정이었어요`
        : `${formatDayLabel(prediction.expectedStart)} 예정`,
    fertileLabel: fertile
      ? `${formatShortDate(fertile.start)} ~ ${formatShortDate(fertile.end)}`
      : null,
    ovulationLabel: fertile ? formatShortDate(fertile.ovulation) : null,
    averagesLabel: `평균 주기 ${prediction.averageCycleLength}일 · 평균 기간 ${prediction.averagePeriodLength}일`,
    basisLabel: prediction.cycleSampleCount
      ? `최근 ${prediction.cycleSampleCount}번의 주기를 기준으로 계산했어요.`
      : "아직 주기를 계산할 기록이 부족해 일반적인 28일 주기로 예측했어요.",
  };
};

const describePrediction = (
  prediction: CyclePrediction | null,
  date: IsoDate,
): string | null => {
  if (!prediction) return null;
  if (prediction.periods.some((range) => isInRange(date, range))) return "생리 예정일";
  if (prediction.fertileWindows.some((w) => w.ovulation === date)) return "배란 예정일 · 가임기";
  if (prediction.fertileWindows.some((range) => isInRange(date, range))) return "가임기";
  return null;
};

export function usePeriodCalendar() {
  const today = useToday();
  const records = useSharedPeriodRecords();

  // null이면 아직 사용자가 고르지 않은 것 → 오늘 기준으로 본다.
  const [pickedMonth, setPickedMonth] = useState<Date | null>(null);
  const [pickedDate, setPickedDate] = useState<IsoDate | null>(null);

  const isReady = today !== null && records !== null;
  const selectedDate = pickedDate ?? today;
  const visibleMonth =
    pickedMonth ?? (today ? startOfMonth(fromIsoDate(today)) : null);

  const prediction = useMemo(
    () => (records && today ? predictCycles(records, today) : null),
    [records, today],
  );

  const summary = useMemo(
    () =>
      prediction && records && today
        ? buildCycleSummary(prediction, records, today)
        : null,
    [prediction, records, today],
  );

  const weeks = useMemo(() => {
    if (!today || !records || !visibleMonth || !selectedDate) return [];
    return buildMonthGrid({
      month: visibleMonth,
      records,
      prediction,
      today,
      selectedDate,
    });
  }, [today, records, prediction, visibleMonth, selectedDate]);

  const selectedRecord =
    records && selectedDate ? findRecordContaining(records, selectedDate) : undefined;

  const selectedStatus = useMemo((): SelectedDayStatus | null => {
    if (!today || !selectedDate) return null;
    if (selectedRecord) {
      const dayNumber =
        getPeriodLength({ ...selectedRecord, endDate: selectedDate });
      return {
        kind: "in-period",
        dayNumber,
        periodLength: getPeriodLength(selectedRecord),
      };
    }
    if (selectedDate > today) return { kind: "future" };
    return { kind: "none" };
  }, [today, selectedDate, selectedRecord]);

  const selectedPrediction =
    selectedDate && !selectedRecord
      ? describePrediction(prediction, selectedDate)
      : null;

  const history = useMemo((): PeriodHistoryItem[] => {
    if (!records) return [];
    return [...records]
      .reverse()
      .slice(0, HISTORY_LIMIT)
      .map((record: PeriodRecord) => ({
        id: record.id,
        startDate: record.startDate,
        rangeLabel: `${formatShortDate(record.startDate)} ~ ${formatShortDate(record.endDate)}`,
        lengthLabel: `${getPeriodLength(record)}일`,
      }));
  }, [records]);

  const moveMonth = (offset: number) => {
    if (visibleMonth) setPickedMonth(addMonths(visibleMonth, offset));
  };

  const selectDate = (date: IsoDate) => {
    setPickedDate(date);
    setPickedMonth(startOfMonth(fromIsoDate(date)));
  };

  const goToToday = () => {
    setPickedDate(null);
    setPickedMonth(null);
  };

  return {
    isReady,
    summary,
    monthLabel: visibleMonth ? formatMonthLabel(visibleMonth) : "",
    weeks,
    selectedDayLabel: selectedDate ? formatDayLabel(selectedDate) : "",
    selectedStatus,
    selectedPrediction,
    history,
    goToPrevMonth: () => moveMonth(-1),
    goToNextMonth: () => moveMonth(1),
    goToToday,
    selectDate,
  };
}
