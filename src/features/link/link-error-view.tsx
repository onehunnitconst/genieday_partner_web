import { Button } from "@/components/ui/button";

export type LinkErrorViewProps = {
  onRetry: () => void;
};

export function LinkErrorView({ onRetry }: LinkErrorViewProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-3">연결 상태를 확인하지 못했어요</h1>
        <p className="text-body-small text-muted-foreground">인터넷 연결을 확인한 뒤 다시 시도해 주세요.</p>
      </div>
      <Button size="lg" className="h-11 w-full max-w-xs" onClick={onRetry}>
        다시 시도
      </Button>
    </main>
  );
}
