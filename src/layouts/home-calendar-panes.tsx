import { HomeContainer } from "@/features/home/home-container";
import { PeriodCalendarContainer } from "@/features/period-calendar/period-calendar-container";
import { cn } from "@/utils/cn";

type HomeCalendarPanesProps = {
  /** 좁은 화면에서 보여줄 탭 */
  tab: "home" | "calendar";
};

/**
 * 펼친 폴더블(@wide)에서는 홈(왼쪽)과 캘린더(오른쪽)를 함께 보여주고, 좁은 화면에서는 지금 탭만 보여준다.
 * 두 화면은 같은 기록을 나눠 쓰므로 숨긴 쪽을 함께 그려 두어도 기록을 다시 불러오지 않는다.
 * 각 단은 2단일 때 스스로 컨테이너가 되어, 안쪽 화면은 단 폭(약 400~540px)에 맞춰 한 줄로 그려진다.
 */
export function HomeCalendarPanes({ tab }: HomeCalendarPanesProps) {
  return (
    <div className="panes">
      <div className={cn("@wide:@container", tab !== "home" && "hidden @wide:block")}>
        <HomeContainer />
      </div>
      <div className={cn("@wide:@container", tab !== "calendar" && "hidden @wide:block")}>
        <PeriodCalendarContainer />
      </div>
    </div>
  );
}
