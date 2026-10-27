export function HomeSkeleton() {
  return (
    <div aria-busy className="flex flex-col gap-4 @tablet:gap-6">
      <div className="h-80 animate-pulse rounded-xl bg-muted @tablet:h-88" />
      <div className="h-48 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
