import { Moon, Sun } from "lucide-react";
import { cn } from "@/utils/cn";
import type { SkyState } from "../use-home";
import type { DayPhase } from "../utils/cycle-phase";

// 하늘은 info(파랑)·neutral, 해와 달은 warning(호박색) 프리미티브로 칠한다.
const SKY_STYLES: Record<DayPhase, string> = {
  night: "from-neutral-950 via-neutral-900 to-info-950 text-white",
  day: "from-info-300 via-info-200 to-info-50 text-neutral-900",
  noon: "from-info-500 via-info-300 to-warning-50 text-neutral-900",
  evening: "from-info-400 via-primary-300 to-warning-200 text-neutral-900",
};

const BODY_STYLES: Record<DayPhase, string> = {
  night: "bg-warning-50 text-neutral-800 shadow-[0_0_24px_6px] shadow-warning-50/30",
  day: "bg-warning-300 text-warning-600 shadow-[0_0_24px_8px] shadow-warning-200/70",
  noon: "size-14 bg-warning-200 text-warning-500 shadow-[0_0_36px_14px] shadow-warning-100",
  evening: "bg-warning-500 text-warning-100 shadow-[0_0_28px_10px] shadow-warning-300/70",
};

// 밤(생리)·정오(가임기)는 캘린더와 같은 색을 쓴다.
const TRACK_STYLES: Record<DayPhase, string> = {
  night: "bg-period",
  day: "bg-info-400",
  noon: "bg-fertile",
  evening: "bg-warning-500",
};

/** 별 위치 (하늘 영역 기준 %) */
const STARS = [
  [12, 18], [24, 42], [38, 12], [56, 30], [70, 14], [84, 36], [91, 20], [46, 52], [8, 58],
] as const;

// 해가 지나는 길: 하늘 영역 기준 가로 반지름 42%, 세로 반지름 80%, 지평선 높이 92%
const ARC_RX = 42;
const ARC_RY = 80;
const HORIZON = 92;

type CycleSkyProps = {
  /** 주기를 공유해 준 상대의 이름 */
  ownerNickname: string;
  sky: SkyState;
};

/** 주기를 하루에 빗대 보여준다. 밤=생리, 낮=평온한 시기, 정오=가임기, 저녁=PMS */
export function CycleSky({ ownerNickname, sky }: CycleSkyProps) {
  const radians = (sky.celestialAngle * Math.PI) / 180;
  const isNight = sky.phase === "night";
  const Body = isNight ? Moon : Sun;

  return (
    <section
      aria-label="지금 주기"
      className={cn("overflow-hidden rounded-xl bg-linear-to-b", SKY_STYLES[sky.phase])}
    >
      <div aria-hidden className="relative h-36 @tablet:h-44">
        {isNight &&
          STARS.map(([x, y]) => (
            <span
              key={`${x}-${y}`}
              className="absolute size-0.5 rounded-full bg-white/80"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          ))}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
          <path
            d={`M ${50 - ARC_RX} ${HORIZON} A ${ARC_RX} ${ARC_RY} 0 0 1 ${50 + ARC_RX} ${HORIZON}`}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.25}
            strokeDasharray="3 4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span
          className={cn(
            "absolute flex size-11 -translate-1/2 items-center justify-center rounded-full",
            BODY_STYLES[sky.phase],
          )}
          style={{
            left: `${50 + ARC_RX * Math.cos(radians)}%`,
            top: `${HORIZON - ARC_RY * Math.sin(radians)}%`,
          }}
        >
          <Body className="size-6" fill={isNight ? "currentColor" : "none"} />
        </span>
      </div>

      <div className="flex flex-col gap-4 px-5 pb-5">
        <div className="flex flex-col gap-1">
          <span className="w-fit rounded-full bg-white/25 px-2.5 py-0.5 text-label-small backdrop-blur">
            {ownerNickname}님은 지금 {sky.phaseLabel}
          </span>
          <p className="text-heading-1">{sky.headline}</p>
          {sky.nextLabel && <p className="text-body-small opacity-80">{sky.nextLabel}</p>}
        </div>

        <div className="flex flex-col gap-1.5 rounded-xl bg-white/25 p-3 backdrop-blur">
          <div className="relative">
            <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
              {sky.segments.map((segment, i) => (
                <span
                  key={i}
                  className={TRACK_STYLES[segment.phase]}
                  style={{ width: `${segment.widthPercent}%` }}
                />
              ))}
            </div>
            <span
              aria-hidden
              className="absolute top-1/2 size-3.5 -translate-1/2 rounded-full border-2 border-white bg-current shadow"
              style={{ left: `${sky.todayPercent}%` }}
            />
          </div>
          <div aria-hidden className="flex text-label-small opacity-75">
            {sky.segments.map((segment, i) => (
              <span
                key={i}
                className="truncate text-center"
                style={{ width: `${segment.widthPercent}%` }}
              >
                {segment.widthPercent >= 8 ? segment.label : ""}
              </span>
            ))}
          </div>
          <p className="text-caption opacity-75">{sky.cycleDayLabel}</p>
        </div>
      </div>
    </section>
  );
}
