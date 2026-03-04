import { ImageResponse } from "next/og";
import { apiServer, createFallbackCountdown } from "@/lib/api";

export const alt = "Soon — Countdown";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let targetDateFormatted = "";
  try {
    const countdown = await apiServer.getCountdown(slug);
    targetDateFormatted = new Date(countdown.targetDateUtc).toLocaleDateString(
      "en-US",
      { year: "numeric", month: "long", day: "numeric" },
    );
  } catch {
    const fallback = createFallbackCountdown(slug);
    targetDateFormatted = new Date(fallback.targetDateUtc).toLocaleDateString(
      "en-US",
      { year: "numeric", month: "long", day: "numeric" },
    );
  }

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
          fontSize: 36,
          color: "#666",
          maxWidth: 800,
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {slug}
      </div>
      <div
        style={{
          fontSize: 24,
          color: "#666",
          marginTop: 16,
        }}
      >
        {targetDateFormatted}
      </div>
      <div
        style={{
          fontSize: 20,
          color: "#999",
          marginTop: 24,
        }}
      >
        Count down together
      </div>
    </div>,
    { ...size },
  );
}
