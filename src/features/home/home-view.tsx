import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { PhaseGuide } from "./constants";
import { CycleSky } from "./components/cycle-sky";
import { PhaseGuideCard } from "./components/phase-guide-card";
import type { SkyState } from "./use-home";

export type HomeViewProps =
  | { kind: "empty"; ownerNickname: string }
  | { kind: "ready"; ownerNickname: string; sky: SkyState; guide: PhaseGuide };

export function HomeView(props: HomeViewProps) {
  if (props.kind === "empty") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>아직 기록이 없어요</CardTitle>
          <p className="text-body-small text-muted-foreground">
            {props.ownerNickname}님이 지니데이에 생리 시작일을 기록하면, 지금이 주기의 낮인지 밤인지와
            어떻게 챙겨 주면 좋을지 알려드려요.
          </p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4 @tablet:gap-6">
      <CycleSky ownerNickname={props.ownerNickname} sky={props.sky} />
      <PhaseGuideCard guide={props.guide} />
    </div>
  );
}
