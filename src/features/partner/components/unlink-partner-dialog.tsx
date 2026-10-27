import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type UnlinkPartnerDialogProps = {
  ownerNickname: string;
  disabled: boolean;
  onConfirm: () => void;
};

export function UnlinkPartnerDialog({ ownerNickname, disabled, onConfirm }: UnlinkPartnerDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="outline" size="lg" className="w-full" disabled={disabled} />}
      >
        {disabled ? "해제하는 중…" : "연결 해제"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{ownerNickname}님과의 연결을 해제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            더 이상 {ownerNickname}님의 주기를 볼 수 없어요. 다시 연결하려면 새 코드를 받아야 해요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            해제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
