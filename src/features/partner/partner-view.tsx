import { HeartHandshake } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UnlinkPartnerDialog } from "./components/unlink-partner-dialog";

export type PartnerViewProps = {
  ownerNickname: string;
  isUnlinking: boolean;
  unlinkError: string | null;
  onUnlink: () => void;
};

export function PartnerView({
  ownerNickname,
  isUnlinking,
  unlinkError,
  onUnlink,
}: PartnerViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartHandshake aria-hidden className="size-4 text-period" />
          파트너
        </CardTitle>
        <p className="text-body-small text-muted-foreground">
          {ownerNickname}님과 연결되어 주기를 함께 보고 있어요.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <UnlinkPartnerDialog
          ownerNickname={ownerNickname}
          disabled={isUnlinking}
          onConfirm={onUnlink}
        />
        {unlinkError && (
          <p role="alert" className="text-body-small text-destructive">
            {unlinkError}
          </p>
        )}
      </CardContent>

      <CardFooter className="text-caption text-muted-foreground">
        {ownerNickname}님의 생리 기록과 예측을 볼 수만 있고, 바꿀 수는 없어요.
      </CardFooter>
    </Card>
  );
}
