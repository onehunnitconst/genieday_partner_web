"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, House, UserRound, type LucideIcon } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { cn } from "@/utils/cn";

type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const TABS: Tab[] = [
  { href: "/", label: "홈", icon: House },
  { href: "/calendar", label: "캘린더", icon: CalendarDays },
  { href: "/my", label: "마이페이지", icon: UserRound },
];

const isActive = (tab: Tab, pathname: string) =>
  tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

type TabLayoutProps = {
  children?: ReactNode;
};

/**
 * 연결된 뒤의 화면 골격: 상단 헤더 · 본문 · 하단 탭바.
 * 헤더는 셸 안에서 sticky로 붙고, 탭바는 fixed라서 셸 폭(max-w-app)에 맞춘다.
 * 펼친 폴더블(@wide)에서는 홈과 캘린더가 한 화면(HomeCalendarPanes)이라 탭바에 캘린더가 없다.
 */
export function TabLayout({ children }: TabLayoutProps) {
  const pathname = usePathname();
  const current = TABS.find((tab) => isActive(tab, pathname));
  const isHome = current?.href === "/";
  const isCalendar = current?.href === "/calendar";

  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 bg-bg-canvas/90 px-page-margin backdrop-blur @tablet:px-6">
        <LogoMark className="size-6" />
        {/* 홈에서는 탭 이름 대신 앱 이름을 브랜드 글꼴로 보여준다. 펼친 폴더블에서는 캘린더도 홈과 함께 보이므로 마찬가지다. */}
        {(isHome || isCalendar) && (
          <h1 className={cn("flex items-baseline gap-1", !isHome && "hidden @wide:flex")}>
            <span className="font-brand text-heading-2 font-normal">지니데이</span>
            <span className="font-brand text-label-medium font-normal text-primary-text">파트너</span>
          </h1>
        )}
        {!isHome && (
          <h1 className={cn("text-title", isCalendar && "@wide:hidden")}>
            {current?.label ?? "지니데이 파트너"}
          </h1>
        )}
      </header>

      {/* 하단 탭바(h-16)에 가려지지 않도록 그보다 넉넉히 아래를 비운다. 노치 아래 여백은 셸이 준다. */}
      <main className="flex flex-1 flex-col px-page-margin pt-2 pb-24 @tablet:px-6 @tablet:pt-4">
        {children}
      </main>

      <nav
        aria-label="주요 메뉴"
        className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-app border-t border-border-default bg-bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      >
        <ul className="flex h-16">
          {TABS.map((tab) => {
            const active = tab === current;
            const Icon = tab.icon;
            return (
              // 펼친 폴더블에서는 홈이 캘린더를 함께 보여주므로 캘린더 탭을 숨기고 홈 탭을 켠다.
              <li key={tab.href} className={cn("flex-1", tab.href === "/calendar" && "@wide:hidden")}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-full flex-col items-center justify-center gap-1 text-label-small transition-colors outline-none focus-visible:shadow-focus",
                    active ? "text-text-primary" : "text-text-disabled",
                    tab.href === "/" && isCalendar && "@wide:text-text-primary",
                  )}
                >
                  <Icon aria-hidden className="size-6" />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
