"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");
  const url = `${baseUrl}/c/${slug}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
      <span>Share this countdown:</span>
      <div className="flex items-center gap-2">
        <code className="rounded-md bg-muted px-3 py-2 font-mono text-xs">
          {url}
        </code>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="shrink-0"
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="size-4 text-green-600" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
