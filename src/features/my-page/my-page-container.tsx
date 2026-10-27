"use client";

import { AccountContainer } from "@/features/account/account-container";
import { PartnerContainer } from "@/features/partner/partner-container";
import { ThemeSettingsContainer } from "@/features/theme-settings/theme-settings-container";
import { MyPageView } from "./my-page-view";
import { useMyPage } from "./use-my-page";

/** 마이페이지: 프로필, 파트너, 테마, 로그아웃. LinkGateContainer 안에서만 쓸 수 있다. */
export function MyPageContainer() {
  const vm = useMyPage();

  return (
    <MyPageView
      profile={<AccountContainer />}
      partner={<PartnerContainer />}
      theme={<ThemeSettingsContainer />}
      isSigningOut={vm.isSigningOut}
      onSignOut={vm.signOut}
    />
  );
}
