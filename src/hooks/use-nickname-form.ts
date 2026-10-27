"use client";

import { useState } from "react";
import type { LinkStatus } from "@/types/link";
import { nicknameSchema } from "@/utils/nickname";

const SAVE_FAILED_MESSAGE = "이름을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.";

type UseNicknameFormOptions = {
  initialValue?: string;
  /** 서버에 저장된 뒤 바뀐 연결 상태와 함께 호출된다 (화면에 반영하는 용도) */
  onSaved: (status: LinkStatus) => void;
};

/** 내 이름 입력·검증·저장 (PATCH /api/link). */
export function useNicknameForm({ initialValue = "", onSaved }: UseNicknameFormOptions) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const changeValue = (next: string) => {
    setValue(next);
    setError(null);
  };

  const reset = (next = initialValue) => {
    setValue(next);
    setError(null);
  };

  const submit = async (): Promise<boolean> => {
    const parsed = nicknameSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "이름이 올바르지 않아요.");
      return false;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/link", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: parsed.data }),
      });
      const body = (await response.json().catch(() => null)) as {
        status?: LinkStatus;
        error?: string;
      } | null;
      if (!response.ok || !body?.status) {
        setError(body?.error ?? SAVE_FAILED_MESSAGE);
        return false;
      }
      onSaved(body.status);
      return true;
    } catch {
      setError(SAVE_FAILED_MESSAGE);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { value, error, isSaving, changeValue, reset, submit };
}
