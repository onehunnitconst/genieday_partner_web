const LEGEND_ITEMS = [
  { label: "생리", swatch: "bg-period" },
  { label: "생리 예정", swatch: "border-2 border-dashed border-period/50" },
  { label: "가임기", swatch: "bg-fertile-soft" },
  { label: "배란 예정일", swatch: "bg-fertile" },
] as const;

export function CalendarLegend() {
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-caption text-muted-foreground">
      {LEGEND_ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span aria-hidden className={`size-3 rounded-full ${item.swatch}`} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
