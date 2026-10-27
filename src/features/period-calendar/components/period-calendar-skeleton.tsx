export function PeriodCalendarSkeleton() {
  return (
    <div aria-busy className="flex flex-col gap-4 @tablet:gap-6">
      <div className="h-96 animate-pulse rounded-xl bg-muted @tablet:h-128" />
      <div className="h-28 animate-pulse rounded-xl bg-muted" />
      <div className="h-40 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
