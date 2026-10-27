import { z } from "zod";

// 같은 규칙이 마이그레이션 SQL의 CHECK 제약(p_users_nickname_format)에도 있다.
export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 12;

/** 닉네임: 한글·영문·숫자 2–12자 (앞뒤 공백은 지운다) */
export const nicknameSchema = z
  .string()
  .trim()
  .min(NICKNAME_MIN_LENGTH, `닉네임은 ${NICKNAME_MIN_LENGTH}자 이상이어야 해요.`)
  .max(NICKNAME_MAX_LENGTH, `닉네임은 ${NICKNAME_MAX_LENGTH}자까지 쓸 수 있어요.`)
  .regex(/^[가-힣a-zA-Z0-9]+$/, "한글, 영문, 숫자만 쓸 수 있어요.");
