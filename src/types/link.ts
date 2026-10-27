/** 이 기기의 로그인·파트너 연결 상태 */
export type LinkStatus =
  /** Google로 로그인하지 않음 */
  | { kind: "signed-out" }
  /** 로그인했지만 연결된 상대가 없음. suggestedNickname은 지니데이에서 쓰던 닉네임(있으면 이름 칸에 미리 채운다) */
  | { kind: "unlinked"; suggestedNickname: string | null }
  /** nickname은 내 이름, ownerNickname은 주기를 공유해 준 상대의 이름 */
  | { kind: "linked"; nickname: string; ownerNickname: string };
