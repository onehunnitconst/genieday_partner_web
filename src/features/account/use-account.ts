"use client";

import { useState } from "react";
import { useCurrentLink } from "@/features/link/current-link-context";
import { setLinkStatus } from "@/features/link/hooks/use-link-status";
import { useNicknameForm } from "@/hooks/use-nickname-form";

export function useAccount() {
  const link = useCurrentLink();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const nicknameForm = useNicknameForm({
    initialValue: link.nickname,
    onSaved: setLinkStatus,
  });

  const openEdit = () => {
    nicknameForm.reset(link.nickname); // 지난번에 입력하다 만 값 대신 지금 이름에서 시작한다.
    setIsEditOpen(true);
  };

  const changeEditOpen = (open: boolean) => {
    if (!nicknameForm.isSaving) setIsEditOpen(open);
  };

  const saveNickname = async () => {
    if (await nicknameForm.submit()) setIsEditOpen(false);
  };

  return {
    nickname: link.nickname,
    ownerNickname: link.ownerNickname,
    isEditOpen,
    nicknameValue: nicknameForm.value,
    nicknameError: nicknameForm.error,
    isSaving: nicknameForm.isSaving,
    openEdit,
    changeEditOpen,
    changeNickname: nicknameForm.changeValue,
    saveNickname,
  };
}
