<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 프로젝트 아키텍처 규칙

스택: Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui (`base-nova`, Base UI) · pnpm

### 화면 구성: MVVM + Container-Presentational

| 역할 | 파일 | 책임 |
| --- | --- | --- |
| Container | `*-container.tsx` | ViewModel 훅 호출, 상태 분기(로딩/에러/빈 상태), View에 데이터/콜백 전달 |
| View | `*-view.tsx` | Props로 데이터/콜백 수신, 순수 UI 렌더링 (훅·API 호출 금지) |
| ViewModel | `use-*.ts` | API 호출, 비즈니스 로직, 상태 관리, 데이터 가공 |

- `app/`의 `page.tsx`는 라우팅만 담당하고 feature의 Container를 렌더링한다.
- View는 ViewModel을 직접 import하지 않는다. 데이터 흐름: Container → ViewModel → Container → View.

### 디렉터리 구조

```
├── app/                        # App Router 경로 및 페이지 정의
├── src/
│   ├── features/               # 기능별 블록 (Container + View + ViewModel)
│   │   └── [feature]/
│   │       ├── [feature]-container.tsx
│   │       ├── [feature]-view.tsx
│   │       ├── use-[feature].ts      # ViewModel (Custom Hook)
│   │       ├── constants.ts          # feature 전용 상수
│   │       ├── components/           # feature 전용 컴포넌트
│   │       ├── hooks/                # (필요할 때) 화면 내부에서만 쓰는 훅 — ViewModel이 조립하는 부품
│   │       ├── utils/                # (필요할 때) React도 캔버스도 모르는 순수 함수·자료구조
│   │       └── render/               # (필요할 때) 캔버스에 그리는 함수와 그 색·글꼴 표
│   ├── components/             # 전역 재사용 UI 컴포넌트 (shadcn은 components/ui)
│   ├── server/                 # 서버 전용 코드 (비즈니스 로직, 인증 모듈 등)
│   ├── layouts/                # 레이아웃
│   ├── hooks/                  # 전역 커스텀 훅
│   ├── types/                  # 전역 타입 정의
│   └── utils/                  # 유틸리티 (`cn`은 `@/utils/cn`)
```

- import 별칭: `@/*` → `src/*` (예: `@/features/calendar/calendar-container`)
- shadcn 컴포넌트 추가: `pnpm dlx shadcn@latest add <component>` → `src/components/ui/`
- 파일명은 kebab-case.

### 반응형: 모바일/태블릿 전용

데스크톱 레이아웃은 만들지 않는다. 모든 화면은 `src/layouts/app-shell.tsx`(루트 레이아웃에서 적용)의 폭 안에서만 그려지고, 데스크톱 창에서는 가운데 정렬된 프레임으로 보인다.

| 구간 | 기준 (앱 셸 폭) | 사용법 |
| --- | --- | --- |
| 모바일 | < 600px | 기본 스타일 (모바일 우선) |
| 태블릿 | ≥ 600px | `@tablet:` |
| 최대 폭 | 768px | `max-w-app` |

- 뷰포트 브레이크포인트(`sm:` `md:` `lg:` …) 대신 컨테이너 쿼리(`@tablet:`)를 쓴다. 셸 폭은 제한되므로 뷰포트 기준은 데스크톱에서 틀린 결과를 낸다.
- 토큰은 `app/globals.css`의 `@theme`(`--container-tablet`, `--container-app`)에 있다.
- `fixed` 요소(하단 탭바, 플로팅 버튼 등)는 셸을 벗어나므로 `fixed inset-x-0 mx-auto max-w-app`처럼 폭을 맞추거나, 셸 안에서 `sticky`를 쓴다.
- 높이는 `h-screen` 대신 `dvh`를 쓰고, 노치 영역은 셸이 `env(safe-area-inset-*)`로 처리한다.

### 디자인 시스템: OHC

토큰 원본은 `../ohc_design_system`이며 `src/styles/ohc-tokens.css`로 가져왔다(`../period_check`와 같은 방식). Primary·Secondary만 앱 색으로 바꿨다.

| 역할 | 앱 색 | 클래스 예시 |
| --- | --- | --- |
| Primary | 보라 `#864AD2` (생리·로고) | `bg-primary-solid`, `text-primary-text`, `bg-period` |
| Secondary | 틸 `#0A8C8C` (가임기) | `bg-secondary-solid`, `text-secondary-text`, `bg-fertile` |

- 기본 Tailwind 팔레트는 지웠다. 색은 OHC 토큰(`bg-bg-canvas`, `text-text-secondary`, `bg-info-300` …)이나 shadcn 별칭(`bg-muted`, `text-muted-foreground`)으로만 쓴다.
- 글자 크기는 텍스트 스타일(`text-heading-2`, `text-title`, `text-body-small`, `text-caption` …)을 쓰고 `text-sm`·`font-semibold` 조합은 쓰지 않는다.
- 앱 이름 "지니데이"는 브랜드 글꼴(`font-brand font-normal`)로 쓴다.
- OHC의 Desktop 값(뷰포트 48rem 이상)은 셸 폭과 맞지 않아 뺐다. 언제나 Mobile 값을 쓴다.
- `cn`은 `@/utils/cn`(OHC 키를 아는 버전)을 쓴다. shadcn으로 추가한 컴포넌트의 `from "cn"`은 바꿔 준다.

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
