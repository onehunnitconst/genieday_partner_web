"use client";

import { PeriodCalendarSkeleton } from "./components/period-calendar-skeleton";
import { PeriodCalendarView } from "./period-calendar-view";
import { usePeriodCalendar } from "./use-period-calendar";

export function PeriodCalendarContainer() {
  const vm = usePeriodCalendar();

  // 오늘 날짜는 기기에서, 기록은 서버에서 읽어 오므로 그 전까지는 뼈대를 보여준다.
  if (!vm.isReady || !vm.selectedStatus) return <PeriodCalendarSkeleton />;

  return (
    <PeriodCalendarView
      summary={vm.summary}
      monthLabel={vm.monthLabel}
      weeks={vm.weeks}
      selectedDayLabel={vm.selectedDayLabel}
      selectedStatus={vm.selectedStatus}
      selectedPrediction={vm.selectedPrediction}
      history={vm.history}
      onPrevMonth={vm.goToPrevMonth}
      onNextMonth={vm.goToNextMonth}
      onToday={vm.goToToday}
      onSelectDate={vm.selectDate}
    />
  );
}
