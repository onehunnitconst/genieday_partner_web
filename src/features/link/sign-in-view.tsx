import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export type SignInViewProps = {
  isSigningIn: boolean;
  errorMessage: string | null;
  onSignInWithGoogle: () => void;
};

export function SignInView({ isSigningIn, errorMessage, onSignInWithGoogle }: SignInViewProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1>
          <Logo />
        </h1>
        <p className="text-body-small text-muted-foreground">
          Google로 로그인한 뒤 상대에게 받은 연결 코드를 입력하면
          <br />
          생리주기를 함께 볼 수 있어요.
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full"
          disabled={isSigningIn}
          onClick={onSignInWithGoogle}
        >
          {isSigningIn ? "Google로 이동하는 중…" : "Google로 계속하기"}
        </Button>
        {errorMessage && (
          <p role="alert" className="text-center text-body-small text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
    </main>
  );
}
