import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { SelectedDayStatus } from "../use-period-calendar";

type SelectedDayPanelProps = {
  dayLabel: string;
  status: SelectedDayStatus;
  predictionLabel: string | null;
};

export function SelectedDayPanel({ dayLabel, status, predictionLabel }: SelectedDayPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dayLabel}</CardTitle>
        {predictionLabel && (
          <p className="text-label-medium text-secondary-text">{predictionLabel} (예측)</p>
        )}
        {(status.kind !== "future" || !predictionLabel) && (
          <p className="text-body-small text-muted-foreground">{describeStatus(status)}</p>
        )}
      </CardHeader>
    </Card>
  );
}

function describeStatus(status: SelectedDayStatus) {
  switch (status.kind) {
    case "future":
      return "아직 오지 않은 날이에요.";
    case "in-period":
      return `생리 ${status.dayNumber}일차 · 총 ${status.periodLength}일`;
    case "none":
      return "기록이 없어요.";
  }
}
