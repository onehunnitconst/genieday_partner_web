"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentLink } from "@/features/link/current-link-context";
import { setLinkStatus } from "@/features/link/hooks/use-link-status";
import type { LinkStatus } from "@/types/link";

const UNLINK_FAILED_MESSAGE = "연결을 해제하지 못했어요. 잠시 후 다시 시도해 주세요.";

export function usePartner() {
  const router = useRouter();
  const link = useCurrentLink();
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [unlinkError, setUnlinkError] = useState<string | null>(null);

  const unlink = async () => {
    setIsUnlinking(true);
    setUnlinkError(null);
    try {
      const response = await fetch("/api/link", { method: "DELETE" });
      const body = (await response.json().catch(() => null)) as { status?: LinkStatus } | null;
      if (!body?.status) {
        setUnlinkError(UNLINK_FAILED_MESSAGE);
        return;
      }
      // 다시 연결하면 마이페이지가 아니라 홈에서 시작하도록 먼저 홈으로 옮겨 둔다.
      // 로그인은 그대로라 게이트가 코드 입력 화면을 보여준다 (그사이 로그아웃됐으면 로그인 화면).
      router.replace("/");
      setLinkStatus(body.status);
    } catch {
      setUnlinkError(UNLINK_FAILED_MESSAGE);
    } finally {
      setIsUnlinking(false);
    }
  };

  return {
    ownerNickname: link.ownerNickname,
    isUnlinking,
    unlinkError,
    unlink,
  };
}
