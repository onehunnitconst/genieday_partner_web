"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import type { ThemeValue } from "./constants";

const subscribeNoop = () => () => {};

const isThemeValue = (value: string | undefined): value is ThemeValue =>
  value === "system" || value === "light" || value === "dark";

export function useThemeSettings() {
  const { theme, setTheme } = useTheme();
  // 고른 테마는 기기(localStorage)에만 있어서 서버 렌더링 중에는 알 수 없다.
  const isMounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  return {
    /** 아직 알 수 없으면 null */
    value: isMounted ? (isThemeValue(theme) ? theme : "system") : null,
    changeTheme: (value: ThemeValue) => setTheme(value),
  };
}
