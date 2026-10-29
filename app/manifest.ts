import type { MetadataRoute } from "next";

// 홈 화면에 설치할 수 있게 하는 웹 앱 매니페스트. 아이콘은 app/pwa-icons/[variant]/route.tsx가 그린다.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "지니데이 파트너",
    short_name: "지니데이 파트너",
    description: "파트너의 생리주기 함께 보기",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#F8FAFC",
    icons: [
      { src: "/pwa-icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icons/maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
