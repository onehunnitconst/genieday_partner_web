"use client";

import { ThemeSettingsView } from "./theme-settings-view";
import { useThemeSettings } from "./use-theme-settings";

/** 시스템/라이트/다크 테마 선택. 루트 레이아웃의 ThemeProvider 안에서만 쓸 수 있다. */
export function ThemeSettingsContainer() {
  const vm = useThemeSettings();

  return <ThemeSettingsView value={vm.value} onChange={vm.changeTheme} />;
}
