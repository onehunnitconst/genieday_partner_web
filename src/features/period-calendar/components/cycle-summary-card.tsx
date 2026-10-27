import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import type { CycleSummary } from "../use-period-calendar";

type CycleSummaryCardProps = {
  summary: CycleSummary | null;
};

export function CycleSummaryCard({ summary }: CycleSummaryCardProps) {
  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>다음 생리일 예측</CardTitle>
          <p className="text-body-small text-muted-foreground">
            상대가 생리 시작일을 기록하면 다음 생리일과 가임기를 볼 수 있어요.
          </p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn(
            "text-heading-3",
            summary.isLate ? "text-destructive" : "text-period",
          )}
        >
          {summary.headline}
        </CardTitle>
        <p className="text-body-small text-muted-foreground">{summary.nextPeriodLabel}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-body-small">
        {summary.fertileLabel && (
          <SummaryRow label="가임기" value={summary.fertileLabel} />
        )}
        {summary.ovulationLabel && (
          <SummaryRow label="배란 예정일" value={summary.ovulationLabel} />
        )}
        <p className="text-muted-foreground">{summary.averagesLabel}</p>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-caption text-muted-foreground">
        <p>{summary.basisLabel}</p>
        <p>예측은 참고용이며 피임 수단으로 사용할 수 없어요.</p>
      </CardFooter>
    </Card>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted-foreground">
        <span aria-hidden className="size-2 rounded-full bg-fertile" />
        {label}
      </span>
      <span className="text-numeric-small">{value}</span>
    </div>
  );
}
