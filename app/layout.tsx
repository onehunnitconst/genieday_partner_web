import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/layouts/app-shell";
import "./globals.css";

// OHC 디자인 시스템 글꼴: 본문 Pretendard, 코드·숫자 JetBrains Mono (src/styles/ohc-tokens.css)
const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "지니데이 파트너",
  description: "파트너의 생리주기 함께 보기",
  // iOS 홈 화면에 추가했을 때 주소창 없이 앱처럼 열린다 (iOS 웹 푸시는 이렇게 설치한 경우에만 된다)
  appleWebApp: {
    capable: true,
    title: "지니데이 파트너",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // --ohc-bg-canvas (헤더 배경과 같다). 앱에서 고른 테마가 기기 설정과 다르면 상태바 색은 기기 설정을 따른다.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1020" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // next-themes가 하이드레이션 전에 <html>에 dark 클래스를 붙이므로 그 차이는 경고하지 않는다
    <html
      lang="ko"
      className={`${pretendard.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
