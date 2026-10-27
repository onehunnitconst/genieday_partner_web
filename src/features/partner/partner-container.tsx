"use client";

import { PartnerView } from "./partner-view";
import { usePartner } from "./use-partner";

/** 주기를 공유해 준 상대와 연결 해제. LinkGateContainer 안에서만 쓸 수 있다. */
export function PartnerContainer() {
  const vm = usePartner();

  return (
    <PartnerView
      ownerNickname={vm.ownerNickname}
      isUnlinking={vm.isUnlinking}
      unlinkError={vm.unlinkError}
      onUnlink={vm.unlink}
    />
  );
}
