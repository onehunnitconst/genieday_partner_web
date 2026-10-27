"use client";

import { useMemo } from "react";
import { useCurrentLink } from "@/features/link/current-link-context";
import { useSharedPeriodRecords } from "@/features/period-calendar/period-records-context";
import {
  predictCycles,
  type CyclePrediction,
} from "@/features/period-calendar/utils/cycle-prediction";
import { useToday } from "@/hooks/use-today";
import { PHASE_GUIDES, type PhaseGuide, type PhaseGuideKey } from "./constants";
import {
  buildCycleTimeline,
  findNextPhase,
  getCelestialAngle,
  type CycleTimeline,
  type DayPhase,
} from "./utils/cycle-phase";

export type SkySegment = {
  phase: DayPhase;
  label: string;
  widthPercent: number;
};

export type SkyState = {
  phase: DayPhase;
  /** 밤 · 낮 · 정오 · 저녁 */
  phaseLabel: string;
  headline: string;
  /** 다음 시기까지 남은 날. 늦어지는 중이면 null */
  nextLabel: string | null;
  cycleDayLabel: string;
  /** 해(달)의 위치. 0°는 오른쪽 지평선, 180°는 왼쪽 지평선 */
  celestialAngle: number;
  segments: SkySegment[];
  todayPercent: number;
};

export type HomeState =
  | { kind: "loading" }
  | { kind: "empty"; ownerNickname: string }
  | { kind: "ready"; ownerNickname: string; sky: SkyState; guide: PhaseGuide };

const PHASE_LABELS: Record<DayPhase, string> = {
  night: "밤",
  day: "낮",
  noon: "정오",
  evening: "저녁",
};

/** "~까지 N일"에 쓰는 다가올 시기 이름 */
const UPCOMING_LABELS: Record<DayPhase, string> = {
  night: "생리 예정일",
  day: "평온한 시기",
  noon: "가임기",
  evening: "PMS 시기",
};

const describeHeadline = (timeline: CycleTimeline, prediction: CyclePrediction) => {
  const { current, todayIndex } = timeline;
  switch (current.phase) {
    case "night":
      return `생리 ${todayIndex - current.startIndex + 1}일차`;
    case "day":
      return "평온한 시기";
    case "noon":
      return timeline.isOvulationDay ? "배란 예정일" : "가임기";
    case "evening":
      return prediction.lateDays > 0
        ? `예정일보다 ${prediction.lateDays}일 늦어지고 있어요`
        : "PMS 시기";
  }
};

const describeNext = (timeline: CycleTimeline, prediction: CyclePrediction) => {
  const next = findNextPhase(timeline, prediction);
  if (!next) return null;
  if (next.daysUntil === 0) return "오늘이 생리 예정일이에요";
  return `${UPCOMING_LABELS[next.phase]}까지 ${next.daysUntil}일`;
};

const pickGuideKey = (timeline: CycleTimeline, prediction: CyclePrediction): PhaseGuideKey => {
  switch (timeline.current.phase) {
    case "night":
      return "night";
    case "day":
      return timeline.isAfterNoon ? "afternoon" : "morning";
    case "noon":
      return "noon";
    case "evening":
      return prediction.lateDays > 0 ? "late" : "evening";
  }
};

const buildSky = (timeline: CycleTimeline, prediction: CyclePrediction): SkyState => {
  const totalDays = timeline.segments.reduce((sum, s) => sum + s.days, 0);
  return {
    phase: timeline.current.phase,
    phaseLabel: PHASE_LABELS[timeline.current.phase],
    headline: describeHeadline(timeline, prediction),
    nextLabel: describeNext(timeline, prediction),
    cycleDayLabel: `주기 ${timeline.todayIndex + 1}일차 · 평균 ${prediction.averageCycleLength}일`,
    celestialAngle: getCelestialAngle(timeline),
    segments: timeline.segments.map((s) => ({
      phase: s.phase,
      label: PHASE_LABELS[s.phase],
      widthPercent: (s.days / totalDays) * 100,
    })),
    todayPercent: ((timeline.todayIndex + 0.5) / totalDays) * 100,
  };
};

export function useHome(): HomeState {
  const { ownerNickname } = useCurrentLink();
  const today = useToday();
  const records = useSharedPeriodRecords();

  return useMemo((): HomeState => {
    if (!today || !records) return { kind: "loading" };
    const prediction = predictCycles(records, today);
    const timeline = prediction && buildCycleTimeline(records, prediction, today);
    if (!prediction || !timeline) return { kind: "empty", ownerNickname };
    return {
      kind: "ready",
      ownerNickname,
      sky: buildSky(timeline, prediction),
      guide: PHASE_GUIDES[pickGuideKey(timeline, prediction)],
    };
  }, [today, records, ownerNickname]);
}
