"use client";

import { useState } from "react";
import { signOut } from "@/features/link/use-link";

export function useMyPage() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  // 로그아웃되면 LinkGateContainer가 로그인 화면으로 바꾸므로 성공했을 때는 되돌리지 않는다.
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (cause) {
      console.error(cause);
      setIsSigningOut(false);
    }
  };

  return { isSigningOut, signOut: handleSignOut };
}
