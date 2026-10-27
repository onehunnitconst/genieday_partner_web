import { Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { THEME_OPTIONS, type ThemeValue } from "./constants";

export type ThemeSettingsViewProps = {
  value: ThemeValue | null;
  onChange: (value: ThemeValue) => void;
};

export function ThemeSettingsView({ value, onChange }: ThemeSettingsViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle id="theme-settings-title" className="flex items-center gap-2">
          <Palette aria-hidden className="size-4 text-primary-text" />
          화면 테마
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          role="radiogroup"
          aria-labelledby="theme-settings-title"
          className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1"
        >
          {THEME_OPTIONS.map((option) => {
            const isSelected = option.value === value;
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={value === null}
                onClick={() => onChange(option.value)}
                className={cn(
                  "flex h-10 items-center justify-center gap-1.5 rounded-md text-label-medium transition-colors outline-none focus-visible:shadow-focus",
                  isSelected
                    ? "bg-bg-surface text-text-primary shadow-elevation-1"
                    : "text-text-secondary hover:text-text-primary",
                )}
              >
                <Icon aria-hidden className="size-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
