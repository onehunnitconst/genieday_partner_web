import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { IsoDate } from "@/types/period";
import { CalendarLegend } from "./components/calendar-legend";
import { CycleSummaryCard } from "./components/cycle-summary-card";
import { MonthCalendar } from "./components/month-calendar";
import { PeriodHistory } from "./components/period-history";
import { SelectedDayPanel } from "./components/selected-day-panel";
import type { CalendarDay } from "./utils/build-month-grid";
import type {
  CycleSummary,
  PeriodHistoryItem,
  SelectedDayStatus,
} from "./use-period-calendar";

export type PeriodCalendarViewProps = {
  summary: CycleSummary | null;
  monthLabel: string;
  weeks: CalendarDay[][];
  selectedDayLabel: string;
  selectedStatus: SelectedDayStatus;
  selectedPrediction: string | null;
  history: PeriodHistoryItem[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectDate: (date: IsoDate) => void;
};

export function PeriodCalendarView({
  summary,
  monthLabel,
  weeks,
  selectedDayLabel,
  selectedStatus,
  selectedPrediction,
  history,
  onPrevMonth,
  onNextMonth,
  onToday,
  onSelectDate,
}: PeriodCalendarViewProps) {
  return (
    <div className="flex flex-col gap-4 @tablet:gap-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-heading-3">{monthLabel}</h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={onToday}>
              오늘
            </Button>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="이전 달"
              onClick={onPrevMonth}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="다음 달"
              onClick={onNextMonth}
            >
              <ChevronRight />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <MonthCalendar weeks={weeks} onSelectDate={onSelectDate} />
          <CalendarLegend />
        </CardContent>
      </Card>

      <SelectedDayPanel
        dayLabel={selectedDayLabel}
        status={selectedStatus}
        predictionLabel={selectedPrediction}
      />

      <CycleSummaryCard summary={summary} />

      <PeriodHistory items={history} onSelect={onSelectDate} />
    </div>
  );
}
