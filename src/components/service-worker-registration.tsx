"use client";

import { useEffect } from "react";

/**
 * public/sw.js를 등록한다. 루트 레이아웃에 한 번만 둔다. (화면에는 아무것도 그리지 않는다)
 * 푸시 구독은 등록된 워커(navigator.serviceWorker.ready)에서 따로 한다.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((cause: unknown) => console.error("서비스 워커를 등록하지 못했습니다.", cause));
  }, []);

  return null;
}
