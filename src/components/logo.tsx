import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

/**
 * 로고 마크: 지니데이 로고(물방울 · 초승달 · 반원으로 그린 지니의 램프)를 사람 모양으로 바꿨다.
 * 위에서부터 물방울(머리), 뿔이 아래로 향한 초승달(든든한 어깨), 폭을 좁힌 반원 두 개(다리)가
 * 서로 떨어져 서 있다. 도형의 크기·간격 비율은 지니데이 로고와 같다.
 * app/icon.svg, app/apple-icon.tsx, app/pwa-icons와 같은 모양이다. (64×64 좌표)
 * 모든 도형은 maskable 아이콘의 안전 영역(가운데 반지름 25.6) 안에 있다.
 */
export const LOGO_COLOR = "#864AD2"; // --ohc-primary-500
export const LOGO_BODY_COLOR = "#EFE7FF"; // --ohc-primary-100
export const LOGO_DROP_COLOR = "#FFFFFF";

/** 뒤에서 앞 순서. ImageResponse(아이콘 생성)에서도 그대로 그린다. */
export const LOGO_SHAPES: { d: string; fill: string }[] = [
  // 다리: 폭을 좁힌 반원 두 개
  { d: "M18.5 53A6 11.76 0 0 1 30.5 53Z", fill: LOGO_BODY_COLOR },
  { d: "M33.5 53A6 11.76 0 0 1 45.5 53Z", fill: LOGO_BODY_COLOR },
  // 어깨: 지니데이 램프의 초승달을 위아래로 뒤집었다
  { d: "M11 44.7A22.94 22.94 0 0 1 53 44.7A33.84 33.84 0 0 0 11 44.7Z", fill: LOGO_BODY_COLOR },
  // 머리: 물방울 (지니데이 로고와 같다)
  {
    d: "M32 11C32 11 27.5 19 27.5 23.5a4.5 4.5 0 0 0 9 0C36.5 19 32 11 32 11Z",
    fill: LOGO_DROP_COLOR,
  },
];

/** LOGO_SHAPES를 <path>로 그린다. <svg viewBox="0 0 64 64"> 안에 넣는다. */
export const renderLogoShapes = () =>
  LOGO_SHAPES.map((shape) => <path key={shape.d} d={shape.d} fill={shape.fill} />);

export function LogoMark({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cn("size-8", className)} {...props}>
      <rect width="64" height="64" rx="16" fill={LOGO_COLOR} />
      {renderLogoShapes()}
    </svg>
  );
}

/** 마크 + 앱 이름 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-10" />
      <span className="flex items-baseline gap-1.5">
        <span className="font-brand text-heading-1 font-normal">지니데이</span>
        <span className="font-brand text-title font-normal text-primary-text">파트너</span>
      </span>
    </span>
  );
}
