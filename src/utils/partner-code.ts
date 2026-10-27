import { z } from "zod";

export const PARTNER_CODE_LENGTH = 8;

// period_check 앱이 만드는 코드와 같은 규칙: 헷갈리는 0·O·1·I·L을 뺀 대문자·숫자 8자
const PARTNER_CODE_PATTERN = /^[A-HJKMNP-Z2-9]{8}$/;

/** 입력값을 코드 형태로 맞춘다: 대문자로 바꾸고 공백·하이픈 같은 구분 기호는 지운다. */
export const normalizePartnerCode = (value: string) =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, "");

export const partnerCodeSchema = z
  .string()
  .transform(normalizePartnerCode)
  .pipe(
    z
      .string()
      .length(PARTNER_CODE_LENGTH, `코드 ${PARTNER_CODE_LENGTH}자리를 모두 입력해 주세요.`)
      .regex(PARTNER_CODE_PATTERN, "코드에 쓰이지 않는 글자가 있어요. 다시 확인해 주세요."),
  );
