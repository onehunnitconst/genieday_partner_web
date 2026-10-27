import type { FormEvent } from "react";
import { Logo } from "@/components/logo";
import { NicknameField } from "@/components/nickname-field";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PARTNER_CODE_LENGTH } from "@/utils/partner-code";

export type LinkFormViewProps = {
  /** 연결돼 있던 기기인데 해제됨 */
  wasUnlinked: boolean;
  code: string;
  nickname: string;
  codeError: string | null;
  nicknameError: string | null;
  formError: string | null;
  isSubmitting: boolean;
  isSigningOut: boolean;
  onCodeChange: (value: string) => void;
  onNicknameChange: (value: string) => void;
  onSubmit: () => void;
  /** 다른 Google 계정으로 로그인하려고 로그아웃한다 */
  onSignOut: () => void;
};

export function LinkFormView({
  wasUnlinked,
  code,
  nickname,
  codeError,
  nicknameError,
  formError,
  isSubmitting,
  isSigningOut,
  onCodeChange,
  onNicknameChange,
  onSubmit,
  onSignOut,
}: LinkFormViewProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1>
          <Logo />
        </h1>
        <p className="text-body-small text-muted-foreground">
          상대의 지니데이 앱에서 만든 연결 코드를 입력하면
          <br />
          생리주기를 함께 볼 수 있어요.
        </p>
      </div>

      {wasUnlinked && (
        <p
          role="status"
          className="w-full max-w-xs rounded-lg bg-primary-subtle px-3 py-2 text-center text-body-small text-primary-text"
        >
          연결이 해제되었어요. 다시 연결하려면 새 코드를 받아 주세요.
        </p>
      )}

      <form className="flex w-full max-w-xs flex-col gap-4" onSubmit={handleSubmit}>
        <Field data-invalid={codeError ? true : undefined}>
          <FieldLabel htmlFor="partner-code">연결 코드</FieldLabel>
          <Input
            id="partner-code"
            value={code}
            maxLength={PARTNER_CODE_LENGTH + 1} // 하이픈 등을 섞어 붙여 넣어도 잘리지 않게 한 글자 여유를 둔다
            autoComplete="one-time-code"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
            disabled={isSubmitting}
            aria-invalid={codeError ? true : undefined}
            placeholder={"X".repeat(PARTNER_CODE_LENGTH)}
            className="h-12 text-center font-mono text-numeric-medium tracking-[0.25em] placeholder:text-text-disabled"
            onChange={(event) => onCodeChange(event.target.value)}
          />
          {codeError ? (
            <FieldError>{codeError}</FieldError>
          ) : (
            <FieldDescription>영문 대문자와 숫자로 된 {PARTNER_CODE_LENGTH}자리 코드예요.</FieldDescription>
          )}
        </Field>

        <NicknameField
          id="partner-nickname"
          value={nickname}
          error={nicknameError}
          disabled={isSubmitting}
          description="상대 앱에 보일 이름이에요. 한글, 영문, 숫자 2~12자."
          onChange={onNicknameChange}
        />

        <div className="flex flex-col gap-2">
          <Button type="submit" size="lg" className="h-11 w-full" disabled={isSubmitting}>
            {isSubmitting ? "연결하는 중…" : "연결하기"}
          </Button>
          {formError && (
            <p role="alert" className="text-center text-body-small text-destructive">
              {formError}
            </p>
          )}
        </div>
      </form>

      <Button
        variant="ghost"
        size="sm"
        className="text-text-secondary"
        disabled={isSubmitting || isSigningOut}
        onClick={onSignOut}
      >
        {isSigningOut ? "로그아웃하는 중…" : "다른 계정으로 로그인"}
      </Button>
    </main>
  );
}
