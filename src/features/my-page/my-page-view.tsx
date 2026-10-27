import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export type MyPageViewProps = {
  /** 프로필 카드 (내 이름) */
  profile: ReactNode;
  /** 파트너 연결 카드 (연결 해제 포함) */
  partner: ReactNode;
  /** 화면 테마 카드 */
  theme: ReactNode;
  isSigningOut: boolean;
  onSignOut: () => void;
};

export function MyPageView({ profile, partner, theme, isSigningOut, onSignOut }: MyPageViewProps) {
  return (
    <div className="flex flex-col gap-4 @tablet:gap-6">
      {profile}
      {partner}
      {theme}
      <Button
        variant="ghost"
        size="lg"
        className="h-11 w-full text-text-secondary"
        disabled={isSigningOut}
        onClick={onSignOut}
      >
        <LogOut />
        {isSigningOut ? "로그아웃하는 중…" : "로그아웃"}
      </Button>
    </div>
  );
}
