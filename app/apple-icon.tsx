import { ImageResponse } from "next/og";
import { LOGO_COLOR, renderLogoShapes } from "@/components/logo";

// iOS 홈 화면 아이콘. 모서리는 iOS가 둥글게 깎으므로 배경을 꽉 채운다.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <svg width="180" height="180" viewBox="0 0 64 64">
          {renderLogoShapes()}
        </svg>
      </div>
    ),
    size,
  );
}
