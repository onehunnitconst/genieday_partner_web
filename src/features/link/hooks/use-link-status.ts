"use client";

import { useSyncExternalStore } from "react";
import type { LinkStatus } from "@/types/link";

// 로그인·연결 상태는 게이트·마이페이지·기록 조회가 함께 쓰므로 모듈 하나에 모아 둔다.

const ENDPOINT = "/api/link";

type LinkStore = {
  /** 서버에 아직 묻지 않았으면 null */
  status: LinkStatus | null;
  /** 마지막 확인이 네트워크 오류 등으로 실패함 */
  failed: boolean;
  /** 앱을 쓰는 사이 연결이 끊김 (상대가 해제했거나 다른 기기에서 해제함). 내가 이 기기에서 해제했으면 false */
  wasUnlinked: boolean;
};

const INITIAL_STORE: LinkStore = { status: null, failed: false, wasUnlinked: false };

const listeners = new Set<() => void>();
let store = INITIAL_STORE;
let loading: Promise<void> | null = null;

const update = (next: LinkStore) => {
  store = next;
  listeners.forEach((listener) => listener());
};

/** 이 기기에서 한 로그인·연결·해제 요청의 응답으로 받은 상태를 바로 반영한다. */
export const setLinkStatus = (status: LinkStatus) =>
  update({ status, failed: false, wasUnlinked: false });

/** 서버에 로그인·연결 상태를 다시 묻는다. (상대가 그사이 연결을 해제했을 수 있을 때) */
export const refreshLinkStatus = () => {
  loading ??= (async () => {
    if (store.failed) update({ ...store, failed: false });
    try {
      const response = await fetch(ENDPOINT, { cache: "no-store" });
      if (!response.ok) throw new Error(`연결 상태를 확인하지 못했습니다. (${response.status})`);
      const status = ((await response.json()) as { status: LinkStatus }).status;
      // 연결돼 있다가 연결 없음으로 바뀌었다면 이 기기 밖에서 해제된 것이다.
      const wasUnlinked =
        status.kind === "unlinked" &&
        (store.status?.kind === "linked" || store.wasUnlinked);
      update({ status, failed: false, wasUnlinked });
    } catch (error) {
      console.error(error);
      update({ ...store, failed: true });
    } finally {
      loading = null;
    }
  })();
  return loading;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  if (store.status === null && !store.failed) void refreshLinkStatus();
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => store;
const getServerSnapshot = () => INITIAL_STORE;

export function useLinkStatus(): LinkStore {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
