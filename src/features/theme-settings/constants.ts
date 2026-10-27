import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";

export type ThemeValue = "system" | "light" | "dark";

export const THEME_OPTIONS: { value: ThemeValue; label: string; icon: LucideIcon }[] = [
  { value: "system", label: "시스템", icon: Monitor },
  { value: "light", label: "라이트", icon: Sun },
  { value: "dark", label: "다크", icon: Moon },
];
