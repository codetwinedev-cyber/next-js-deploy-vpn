import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { CountdownDisplay } from "@/components/countdown-display";
import { ShareLink } from "@/components/share-link";
import { Separator } from "@/components/ui/separator";
import { ApiRequestError, apiServer, createFallbackCountdown } from "@/lib/api";
import type { CountdownResponse } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCountdownCached(
  slug: string,
): Promise<CountdownResponse | null> {
  "use cache";
  cacheLife("days");

  try {
    return await apiServer.getCountdown(slug);
  } catch (err) {
    if (err instanceof ApiRequestError && err.statusCode === 404) {
      return null;
    }
    return createFallbackCountdown(slug);
  }
}

const fetchCountdown = cache(getCountdownCached);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const countdown = await fetchCountdown(slug);

  if (!countdown) {
    return { title: "Not Found" };
  }

  const targetFormatted = new Date(countdown.targetDateUtc).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://soon.codetwine.dev";
  const pageUrl = `${baseUrl}/c/${slug}`;

  return {
    title: countdown.title,
    description: countdown.description ?? `Counting down to ${targetFormatted}`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: countdown.title,
      description:
        countdown.description ?? `Counting down to ${targetFormatted}`,
      type: "website",
      url: pageUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: countdown.title,
      description:
        countdown.description ?? `Counting down to ${targetFormatted}`,
    },
  };
}

export default async function CountdownPage({ params }: PageProps) {
  "use cache";
  cacheLife("days");

  const { slug } = await params;
  const countdown = await fetchCountdown(slug);

  if (!countdown) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 sm:py-24">
      <CountdownDisplay
        targetDate={countdown.targetDateUtc}
        title={countdown.title}
        description={countdown.description ?? undefined}
      />

      <div className="mt-12 flex flex-col items-center gap-3">
        <ShareLink slug={countdown.slug} />
        <Separator className="my-4 w-full max-w-sm" />
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 text-md text-muted-foreground hover:text-foreground transition-colors underline"
        >
          <Plus className="size-4" />
          Create another countdown
        </Link>
      </div>
    </div>
  );
}
