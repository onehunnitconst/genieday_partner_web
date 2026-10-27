import { cn } from "@/utils/cn";
import type { IsoDate } from "@/types/period";
import { WEEKDAY_LABELS } from "../constants";
import type { CalendarDay, DayBand } from "../utils/build-month-grid";

type MonthCalendarProps = {
  weeks: CalendarDay[][];
  onSelectDate: (date: IsoDate) => void;
};

export function MonthCalendar({ weeks, onSelectDate }: MonthCalendarProps) {
  return (
    <div role="grid" className="select-none">
      <div role="row" className="grid grid-cols-7 pb-2">
        {WEEKDAY_LABELS.map((label, index) => (
          <div
            key={label}
            role="columnheader"
            className={cn(
              "text-center text-label-small text-muted-foreground",
              index === 0 && "text-destructive/80",
            )}
          >
            {label}
          </div>
        ))}
      </div>
      {weeks.map((week) => (
        <div key={week[0].date} role="row" className="grid grid-cols-7">
          {week.map((day, index) => (
            <DayCell
              key={day.date}
              day={day}
              isWeekStart={index === 0}
              isWeekEnd={index === 6}
              onSelect={onSelectDate}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const BAND_CLASS: Record<DayBand, string> = {
  period: "bg-period-soft",
  "predicted-period": "border-y-2 border-dashed border-period/40",
  fertile: "bg-fertile-soft",
};

const BAND_TEXT_CLASS: Record<DayBand, string> = {
  period: "text-period",
  "predicted-period": "text-period/80",
  fertile: "text-fertile",
};

const BAND_LABEL: Record<DayBand, string> = {
  period: "생리 기간",
  "predicted-period": "생리 예정",
  fertile: "가임기",
};

type DayCellProps = {
  day: CalendarDay;
  isWeekStart: boolean;
  isWeekEnd: boolean;
  onSelect: (date: IsoDate) => void;
};

function DayCell({ day, isWeekStart, isWeekEnd, onSelect }: DayCellProps) {
  const isPeriodEdge = day.band === "period" && (day.isBandStart || day.isBandEnd);
  const isRoundedStart = day.isBandStart || isWeekStart;
  const isRoundedEnd = day.isBandEnd || isWeekEnd;
  const isDashed = day.band === "predicted-period";

  return (
    <div
      role="gridcell"
      className="relative flex h-12 items-center justify-center @tablet:h-16"
    >
      {/* 기간을 주 단위로 이어지는 띠로 표시한다. */}
      {day.band && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 @tablet:h-12",
            BAND_CLASS[day.band],
            isRoundedStart && "left-1 rounded-l-full",
            isRoundedEnd && "right-1 rounded-r-full",
            isDashed && isRoundedStart && "border-l-2",
            isDashed && isRoundedEnd && "border-r-2",
          )}
        />
      )}
      <button
        type="button"
        onClick={() => onSelect(day.date)}
        aria-pressed={day.isSelected}
        aria-current={day.isToday ? "date" : undefined}
        aria-label={[
          day.date,
          day.band && BAND_LABEL[day.band],
          day.isOvulation && "배란 예정일",
        ]
          .filter(Boolean)
          .join(" ")}
        className={cn(
          "relative flex size-10 items-center justify-center rounded-full text-numeric-small tabular-nums transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 @tablet:size-12 @tablet:text-numeric-medium",
          !day.isCurrentMonth && "opacity-35",
          day.band && BAND_TEXT_CLASS[day.band],
          isPeriodEdge && "bg-period font-semibold text-period-foreground",
          day.isOvulation && "bg-fertile font-semibold text-fertile-foreground",
          day.isToday &&
            !isPeriodEdge &&
            !day.isOvulation &&
            "font-bold underline underline-offset-4",
          day.isSelected &&
            "ring-2 ring-foreground ring-offset-2 ring-offset-card",
        )}
      >
        {day.dayOfMonth}
      </button>
    </div>
  );
}
