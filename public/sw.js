// 서비스 워커. src/components/service-worker-registration.tsx가 /sw.js로 등록한다.
// 지금은 웹 푸시만 다룬다. (오프라인 캐시는 하지 않으므로 fetch 이벤트는 받지 않는다)
// 번들러를 거치지 않는 파일이라 import 없이 순수 JS로만 쓴다.

self.addEventListener("install", () => {
  // 새 버전이 받아지면 기다리지 않고 바로 교체한다
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/**
 * 서버가 보내는 푸시 본문: { title: string, body?: string, url?: string, tag?: string }
 * url은 알림을 눌렀을 때 열 앱 안의 경로 (기본 "/")
 */
self.addEventListener("push", (event) => {
  const payload = readPayload(event);
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/pwa-icons/192",
      tag: payload.tag,
      data: { url: payload.url ?? "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url ?? "/", self.location.origin).href;

  // 이미 열린 앱 창이 있으면 그 창을 앞으로 가져와 이동하고, 없으면 새로 연다
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const client = windows.find((w) => new URL(w.url).origin === self.location.origin);
      if (client) return client.focus().then((focused) => focused.navigate(url));
      return self.clients.openWindow(url);
    }),
  );
});

function readPayload(event) {
  try {
    const data = event.data?.json();
    if (data && typeof data.title === "string") return data;
  } catch {
    // JSON이 아니면 본문 문자열을 그대로 보여준다
  }
  return { title: "Period Check Partner", body: event.data?.text() };
}
