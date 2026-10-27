"use client";

import { useState } from "react";
import type { LinkStatus } from "@/types/link";
import { authClient } from "@/utils/auth-client";
import { nicknameSchema } from "@/utils/nickname";
import { normalizePartnerCode, PARTNER_CODE_LENGTH, partnerCodeSchema } from "@/utils/partner-code";
import type { CurrentLink } from "./current-link-context";
import { refreshLinkStatus, setLinkStatus, useLinkStatus } from "./hooks/use-link-status";

export type LinkGateStatus =
  | { kind: "pending" }
  /** 로그인·연결 상태를 확인하지 못함 (네트워크 오류 등) */
  | { kind: "error" }
  | { kind: "signed-out" }
  | { kind: "unlinked"; wasUnlinked: boolean }
  | { kind: "linked"; link: CurrentLink };

const LINK_FAILED_MESSAGE = "연결하지 못했어요. 잠시 후 다시 시도해 주세요.";
const SIGN_IN_FAILED_MESSAGE = "로그인하지 못했어요. 잠시 후 다시 시도해 주세요.";

/** 로그아웃하면 게이트가 로그인 화면으로 바꾼다. 마이페이지와 코드 입력 화면이 함께 쓴다. */
export async function signOut() {
  const { error } = await authClient.signOut();
  if (error) throw new Error(error.message ?? "로그아웃하지 못했습니다.");
  setLinkStatus({ kind: "signed-out" });
}

export function useLink() {
  const { status: linkStatus, failed, wasUnlinked } = useLinkStatus();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [code, setCode] = useState("");
  // null이면 아직 손대지 않은 것 → 지니데이에서 쓰던 닉네임을 미리 채워 둔다.
  const [typedNickname, setTypedNickname] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let status: LinkGateStatus;
  if (!linkStatus) {
    status = failed ? { kind: "error" } : { kind: "pending" };
  } else if (linkStatus.kind === "linked") {
    status = {
      kind: "linked",
      link: { nickname: linkStatus.nickname, ownerNickname: linkStatus.ownerNickname },
    };
  } else if (linkStatus.kind === "unlinked") {
    status = { kind: "unlinked", wasUnlinked };
  } else {
    status = linkStatus;
  }

  const suggestedNickname =
    linkStatus?.kind === "unlinked" ? (linkStatus.suggestedNickname ?? "") : "";
  const nickname = typedNickname ?? suggestedNickname;

  // Google로 갔다가 돌아오면 페이지가 새로 열리며 상태를 다시 묻는다.
  const signInWithGoogle = async () => {
    setIsSigningIn(true);
    setSignInError(null);
    try {
      const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
      if (error) throw new Error(error.message);
    } catch (cause) {
      console.error(cause);
      setSignInError(SIGN_IN_FAILED_MESSAGE);
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setCode("");
      setTypedNickname(null);
      setFormError(null);
    } catch (cause) {
      console.error(cause);
    } finally {
      setIsSigningOut(false);
    }
  };

  const changeCode = (value: string) => {
    setCode(normalizePartnerCode(value).slice(0, PARTNER_CODE_LENGTH));
    setCodeError(null);
    setFormError(null);
  };

  const changeNickname = (value: string) => {
    setTypedNickname(value);
    setNicknameError(null);
    setFormError(null);
  };

  const submit = async () => {
    const parsedCode = partnerCodeSchema.safeParse(code);
    const parsedNickname = nicknameSchema.safeParse(nickname);
    setCodeError(parsedCode.success ? null : (parsedCode.error.issues[0]?.message ?? null));
    setNicknameError(
      parsedNickname.success ? null : (parsedNickname.error.issues[0]?.message ?? null),
    );
    if (!parsedCode.success || !parsedNickname.success) return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      const response = await fetch("/api/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: parsedCode.data, nickname: parsedNickname.data }),
      });
      const body = (await response.json().catch(() => null)) as {
        status?: LinkStatus;
        error?: string;
      } | null;
      if (!response.ok || !body?.status) {
        setFormError(body?.error ?? LINK_FAILED_MESSAGE);
        // 그사이 로그아웃됐다면(다른 탭 등) 로그인 화면으로 돌아간다.
        if (body?.status?.kind === "signed-out") setLinkStatus(body.status);
        return;
      }
      setCode("");
      setTypedNickname(null);
      setLinkStatus(body.status);
    } catch {
      setFormError(LINK_FAILED_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    status,
    isSigningIn,
    signInError,
    isSigningOut,
    code,
    nickname,
    codeError,
    nicknameError,
    formError,
    isSubmitting,
    signInWithGoogle,
    signOut: handleSignOut,
    changeCode,
    changeNickname,
    submit,
    retry: refreshLinkStatus,
  };
}
