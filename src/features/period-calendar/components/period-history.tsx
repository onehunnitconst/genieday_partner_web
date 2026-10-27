import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IsoDate } from "@/types/period";
import type { PeriodHistoryItem } from "../use-period-calendar";

type PeriodHistoryProps = {
  items: PeriodHistoryItem[];
  onSelect: (startDate: IsoDate) => void;
};

export function PeriodHistory({ items, onSelect }: PeriodHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 기록</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-body-small text-muted-foreground">
            아직 기록이 없어요.
          </p>
        ) : (
          <ul className="-mx-2 flex flex-col">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.startDate)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-3 text-left text-body-medium hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="size-2 rounded-full bg-period" />
                    {item.rangeLabel}
                  </span>
                  <span className="text-muted-foreground">{item.lengthLabel}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
