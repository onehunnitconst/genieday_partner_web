import { Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { PhaseGuide } from "../constants";

type PhaseGuideCardProps = {
  guide: PhaseGuide;
};

export function PhaseGuideCard({ guide }: PhaseGuideCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{guide.title}</CardTitle>
        <p className="text-body-small text-muted-foreground">{guide.body}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <h3 className="text-label-medium text-primary-text">이렇게 챙겨 주세요</h3>
        <ul className="flex flex-col gap-2">
          {guide.tips.map((tip) => (
            <li key={tip} className="flex gap-2 text-body-medium">
              <Heart aria-hidden className="mt-1 size-4 shrink-0 text-period" />
              {tip}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="text-caption text-muted-foreground">
        주기 예측을 바탕으로 한 일반적인 안내예요. 사람마다 다를 수 있으니 상대에게 직접 물어봐 주세요.
      </CardFooter>
    </Card>
  );
}
