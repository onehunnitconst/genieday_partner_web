export const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export const HISTORY_LIMIT = 6;

// ── 주기 예측 ──

/** 주기를 계산할 기록이 부족할 때 쓰는 일반적인 주기(일). */
export const DEFAULT_CYCLE_LENGTH = 28;

/** 평균에 반영할 최근 주기 개수. */
export const CYCLE_SAMPLE_SIZE = 6;

/** 이 범위를 벗어나는 주기는 기록 누락·오입력으로 보고 평균에서 뺀다. */
export const MIN_CYCLE_LENGTH = 15;
export const MAX_CYCLE_LENGTH = 60;

/** 배란일은 다음 생리 시작일 기준 이만큼 앞이다. (황체기) */
export const LUTEAL_PHASE_LENGTH = 14;

/** 가임기: 배란일 N일 전 ~ M일 후. */
export const FERTILE_DAYS_BEFORE_OVULATION = 5;
export const FERTILE_DAYS_AFTER_OVULATION = 1;

/** 달력에 미리 보여줄 예측 주기 수. */
export const PREDICTED_CYCLE_COUNT = 6;
