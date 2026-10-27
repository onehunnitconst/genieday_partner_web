"use client";

import { createContext, use, type ReactNode } from "react";

export type CurrentLink = {
  /** 내 이름 */
  nickname: string;
  /** 주기를 공유해 준 상대의 이름 */
  ownerNickname: string;
};

const CurrentLinkContext = createContext<CurrentLink | null>(null);

export function CurrentLinkProvider({
  link,
  children,
}: {
  link: CurrentLink;
  children: ReactNode;
}) {
  return <CurrentLinkContext value={link}>{children}</CurrentLinkContext>;
}

/** 지금 연결된 상대. LinkGateContainer 안에서만 쓸 수 있다. */
export function useCurrentLink(): CurrentLink {
  const link = use(CurrentLinkContext);
  if (!link) throw new Error("useCurrentLink는 LinkGateContainer 안에서만 쓸 수 있습니다.");
  return link;
}
