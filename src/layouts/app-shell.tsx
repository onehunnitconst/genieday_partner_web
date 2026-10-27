import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

/**
 * 모든 화면을 모바일/태블릿 폭(max-w-app)으로 가두는 최상위 레이아웃.
 * 데스크톱에서는 가운데 정렬된 프레임으로 보이고, 내부 반응형은
 * 뷰포트(md:) 대신 이 컨테이너 기준(@tablet:)으로 판단한다.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh justify-center bg-muted">
      <div className="@container relative flex min-h-dvh w-full max-w-app flex-col bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] min-[48rem]:shadow-xl">
        {children}
      </div>
    </div>
  );
}
