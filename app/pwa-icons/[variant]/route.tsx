import { ImageResponse } from "next/og";
import { LOGO_COLOR, renderLogoShapes } from "@/components/logo";

// app/manifest.ts가 가리키는 홈 화면 아이콘. 빌드할 때 PNG로 미리 그려 둔다.
// any: app/icon.svg처럼 둥근 사각형 / maskable: 안드로이드가 원·사각형 등으로 잘라 쓰므로 배경을 꽉 채운다
// (로고는 64×64 좌표의 가운데 반지름 25.6 안전 영역 안에 있어 그대로 써도 잘리지 않는다)
const VARIANTS = {
  "192": { size: 192, radius: 48 },
  "512": { size: 512, radius: 128 },
  maskable: { size: 512, radius: 0 },
} as const;

type Variant = keyof typeof VARIANTS;

const isVariant = (value: string): value is Variant => Object.hasOwn(VARIANTS, value);

export function generateStaticParams() {
  return Object.keys(VARIANTS).map((variant) => ({ variant }));
}

export async function GET(_request: Request, { params }: RouteContext<"/pwa-icons/[variant]">) {
  const { variant } = await params;
  if (!isVariant(variant)) return new Response(null, { status: 404 });

  const { size, radius } = VARIANTS[variant];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: LOGO_COLOR,
          borderRadius: radius,
        }}
      >
        <svg width={size} height={size} viewBox="0 0 64 64">
          {renderLogoShapes()}
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
