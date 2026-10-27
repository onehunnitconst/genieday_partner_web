"use client";

import { HomeSkeleton } from "./components/home-skeleton";
import { HomeView } from "./home-view";
import { useHome } from "./use-home";

export function HomeContainer() {
  const state = useHome();

  // 오늘 날짜는 기기에서, 기록은 서버에서 읽어 오므로 그 전까지는 뼈대를 보여준다.
  if (state.kind === "loading") return <HomeSkeleton />;

  return <HomeView {...state} />;
}
