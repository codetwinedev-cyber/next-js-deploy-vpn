"use client";

import { CheckCircle2, Info, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSlugAvailability } from "@/hooks/use-slug-availability";
import { createCountdownAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getMinDate(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 5);
  return d.toISOString().slice(0, 16);
}

export function CreateCountdownForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const effectiveSlug = autoSlug ? slugify(title) : slug;
  const slugCheck = useSlugAvailability(effectiveSlug);

  const valid =
    title.trim().length >= 1 &&
    targetDate.length > 0 &&
    new Date(targetDate).getTime() > Date.now();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;

    setSubmitting(true);
    const result = await createCountdownAction({
      title: title.trim(),
      description: description.trim() || undefined,
      targetDateUtc: new Date(targetDate).toISOString(),
      slug:
        slugCheck.status === "taken" ? undefined : effectiveSlug || undefined,
    });
    setSubmitting(false);

    if (result.success) {
      toast.success("Countdown created!");
      router.push(`/c/${result.data.slug}`);
    } else {
      toast.error(result.error);
      if (result.error.includes("preview")) {
        const previewSlug = effectiveSlug || slugify(title) || "preview";
        router.push(`/c/${previewSlug}`);
      }
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Create a Countdown</CardTitle>
        <CardDescription>
          Set a target date, share the link, and count down together.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="New Year's Eve 2027"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Let's celebrate together!"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date & Time *</Label>
            <div className="relative">
              <Input
                id="targetDate"
                type="datetime-local"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={getMinDate()}
                required
                className="flex-1 w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Custom slug (optional)</Label>
              <button
                type="button"
                onClick={() => {
                  setAutoSlug(!autoSlug);
                  if (autoSlug) setSlug(slugify(title));
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {autoSlug ? "Customize" : "Use title"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Part of the shareable link (e.g.{" "}
              <code className="rounded bg-muted px-1 py-0.5">
                /c/my-countdown
              </code>
              ). If left empty or if your chosen slug is taken, a unique slug
              will be generated automatically.
            </p>
            <Input
              id="slug"
              placeholder="my-countdown"
              value={effectiveSlug}
              onChange={(e) => {
                setAutoSlug(false);
                setSlug(slugify(e.target.value));
              }}
              disabled={autoSlug}
              maxLength={80}
            />
            {effectiveSlug.length >= 3 && (
              <SlugStatus
                status={slugCheck.status}
                message={slugCheck.message}
                willAutoGenerate={slugCheck.status === "taken"}
              />
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!valid || submitting}
            className="mt-2"
          >
            {submitting && <Loader2 className="animate-spin" />}
            {submitting ? "Creating..." : "Create Countdown"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SlugStatus({
  status,
  message,
  willAutoGenerate,
}: {
  status: string;
  message?: string;
  willAutoGenerate?: boolean;
}) {
  const displayMessage = willAutoGenerate
    ? "This slug is taken — a unique one will be generated automatically"
    : message;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs",
        status === "checking" && "text-muted-foreground",
        status === "available" && "text-emerald-600 dark:text-emerald-400",
        status === "taken" && "text-amber-600 dark:text-amber-400",
        status === "error" && "text-amber-600 dark:text-amber-400",
      )}
    >
      {status === "checking" && (
        <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
      )}
      {status === "available" && <CheckCircle2 className="h-3 w-3 shrink-0" />}
      {status === "taken" && (
        <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
      )}
      {status === "error" && <Info className="h-3 w-3 shrink-0" aria-hidden />}
      <span>{displayMessage ?? "Checking..."}</span>
    </div>
  );
}
