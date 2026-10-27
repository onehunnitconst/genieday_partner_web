"use client";

import type { ReactNode } from "react";
import { CurrentLinkProvider } from "./current-link-context";
import { LinkErrorView } from "./link-error-view";
import { LinkFormView } from "./link-form-view";
import { SignInView } from "./sign-in-view";
import { useLink } from "./use-link";

type LinkGateContainerProps = {
  /** 연결 상태를 확인하는 동안 보여줄 화면 */
  fallback: ReactNode;
  children: ReactNode;
};

/** 로그인하지 않았으면 로그인 화면을, 연결돼 있지 않으면 코드 입력 화면을, 연결돼 있으면 children을 보여준다. */
export function LinkGateContainer({ fallback, children }: LinkGateContainerProps) {
  const vm = useLink();

  switch (vm.status.kind) {
    case "pending":
      return fallback;
    case "error":
      return <LinkErrorView onRetry={vm.retry} />;
    case "signed-out":
      return (
        <SignInView
          isSigningIn={vm.isSigningIn}
          errorMessage={vm.signInError}
          onSignInWithGoogle={vm.signInWithGoogle}
        />
      );
    case "unlinked":
      return (
        <LinkFormView
          wasUnlinked={vm.status.wasUnlinked}
          code={vm.code}
          nickname={vm.nickname}
          codeError={vm.codeError}
          nicknameError={vm.nicknameError}
          formError={vm.formError}
          isSubmitting={vm.isSubmitting}
          isSigningOut={vm.isSigningOut}
          onCodeChange={vm.changeCode}
          onNicknameChange={vm.changeNickname}
          onSubmit={vm.submit}
          onSignOut={vm.signOut}
        />
      );
    case "linked":
      return <CurrentLinkProvider link={vm.status.link}>{children}</CurrentLinkProvider>;
  }
}
