import { ImageResponse } from "next/og";
import { ApiRequestError, apiServer, createFallbackCountdown } from "@/lib/api";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const revalidate = 86400;

async function getOgData(slug: string) {
  try {
    const og = await apiServer.getCountdownOg(slug);
    if (!og) return null;
    return {
      title: og.title,
      remainingSeconds: og.remainingSeconds,
    };
  } catch (err) {
    if (err instanceof ApiRequestError && err.statusCode === 404) {
      return null;
    }
    const fallback = createFallbackCountdown(slug);
    return {
      title: fallback.title,
      remainingSeconds: Math.max(
        0,
        Math.floor(
          (new Date(fallback.targetDateUtc).getTime() - Date.now()) / 1000,
        ),
      ),
    };
  }
}

function parseRemaining(remainingSeconds: number) {
  if (remainingSeconds <= 0) return { expired: true, label: "Done" };
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = Math.floor(remainingSeconds % 60);
  const parts = [days, hours, minutes, seconds]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
  return { expired: false, label: parts };
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ogData = await getOgData(slug);

  if (!ogData) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
          color: "#fafafa",
          fontSize: 24,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Soon
      </div>,
      { ...size },
    );
  }

  const { title, remainingSeconds } = ogData;
  const { expired, label } = parseRemaining(remainingSeconds);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        fontFamily: "system-ui, sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#fafafa",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: 160,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 12,
          padding: "8px 16px",
          background: expired ? "#22c55e" : "#3b82f6",
          color: "#fff",
          borderRadius: 8,
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "monospace",
        }}
      >
        {expired ? "🎉" : label}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "#999",
          marginTop: 8,
        }}
      >
        Soon
      </div>
    </div>,
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    },
  );
}
