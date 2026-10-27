"use client";

import { AccountView } from "./account-view";
import { useAccount } from "./use-account";

/** 프로필(내 이름)과 이름 수정. LinkGateContainer 안에서만 쓸 수 있다. */
export function AccountContainer() {
  const vm = useAccount();

  return (
    <AccountView
      nickname={vm.nickname}
      ownerNickname={vm.ownerNickname}
      isEditOpen={vm.isEditOpen}
      nicknameValue={vm.nicknameValue}
      nicknameError={vm.nicknameError}
      isSaving={vm.isSaving}
      onOpenEdit={vm.openEdit}
      onEditOpenChange={vm.changeEditOpen}
      onNicknameChange={vm.changeNickname}
      onSaveNickname={vm.saveNickname}
    />
  );
}
