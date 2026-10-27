import type { FormEvent } from "react";
import { Pencil, UserRound } from "lucide-react";
import { NicknameField } from "@/components/nickname-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type AccountViewProps = {
  nickname: string;
  ownerNickname: string;
  isEditOpen: boolean;
  nicknameValue: string;
  nicknameError: string | null;
  isSaving: boolean;
  onOpenEdit: () => void;
  onEditOpenChange: (open: boolean) => void;
  onNicknameChange: (value: string) => void;
  onSaveNickname: () => void;
};

export function AccountView({
  nickname,
  ownerNickname,
  isEditOpen,
  nicknameValue,
  nicknameError,
  isSaving,
  onOpenEdit,
  onEditOpenChange,
  onNicknameChange,
  onSaveNickname,
}: AccountViewProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSaveNickname();
  };

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-period-soft text-period">
            <UserRound aria-hidden className="size-6" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-title">{nickname}</span>
            <span className="truncate text-body-small text-muted-foreground">
              {ownerNickname}님의 파트너
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onOpenEdit}>
            <Pencil />
            이름 수정
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={onEditOpenChange}>
        <DialogContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>이름 수정</DialogTitle>
            </DialogHeader>
            <NicknameField
              id="nickname-edit"
              value={nicknameValue}
              error={nicknameError}
              disabled={isSaving}
              description={`${ownerNickname}님 앱에 보일 이름이에요. 한글, 영문, 숫자 2~12자.`}
              autoFocus
              onChange={onNicknameChange}
            />
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" disabled={isSaving} />}>
                취소
              </DialogClose>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "저장하는 중…" : "저장"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
