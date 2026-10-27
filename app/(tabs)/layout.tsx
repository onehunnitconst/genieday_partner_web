import { LinkGateContainer } from "@/features/link/link-gate-container";
import { PeriodRecordsProvider } from "@/features/period-calendar/period-records-context";
import { TabLayout } from "@/layouts/tab-layout";

/** 연결해야 들어올 수 있는 탭 화면들. 연결 코드 입력 화면에는 헤더와 탭바를 붙이지 않는다. */
export default function TabsLayout({ children }: LayoutProps<"/">) {
  return (
    <LinkGateContainer fallback={<TabLayout />}>
      {/* 홈과 캘린더가 같은 기록을 쓰므로 탭을 오가도 한 번만 불러온다. */}
      <PeriodRecordsProvider>
        <TabLayout>{children}</TabLayout>
      </PeriodRecordsProvider>
    </LinkGateContainer>
  );
}
