import { ImageResponse } from "next/og";

export const alt = "Soon — Public Countdown by Link";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#1a1a1a",
          marginBottom: 16,
        }}
      >
        Soon
      </div>
      <div
        style={{
          fontSize: 28,
          color: "#666",
          maxWidth: 600,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        Count down to what matters
      </div>
      <div
        style={{
          fontSize: 20,
          color: "#999",
          marginTop: 32,
        }}
      >
        Create a countdown, share the link, count down together
      </div>
    </div>,
    { ...size },
  );
}
