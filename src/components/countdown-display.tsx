"use client";

import { useCountdown } from "@/hooks/use-countdown";

interface CountdownDisplayProps {
  targetDate: string;
  title: string;
  description?: string;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg sm:h-28 sm:w-28 md:h-32 md:w-32">
        <span className="font-mono text-3xl font-bold tabular-nums sm:text-5xl md:text-6xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground sm:text-sm">
        {label}
      </span>
    </div>
  );
}

export function CountdownDisplay({
  targetDate,
  title,
  description,
}: CountdownDisplayProps) {
  const { days, hours, minutes, seconds, expired } = useCountdown(targetDate);

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto max-w-lg text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {expired ? (
        <div className="space-y-4">
          <div className="text-6xl">🎉</div>
          <p className="text-2xl font-semibold text-primary">
            The countdown has ended!
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center items-end gap-x-3 gap-y-6 sm:gap-x-4 md:gap-x-6">
          <div className="flex items-center gap-1">
            <TimeUnit value={days} label="Days" />
            <span className="pb-8 text-3xl font-bold text-muted-foreground sm:text-5xl animate-pulse">
              :
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TimeUnit value={hours} label="Hours" />
            <span className="pb-8 text-3xl font-bold text-muted-foreground sm:text-5xl animate-pulse">
              :
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TimeUnit value={minutes} label="Min" />
            <span className="pb-8 text-3xl font-bold text-muted-foreground sm:text-5xl animate-pulse">
              :
            </span>
          </div>
          <TimeUnit value={seconds} label="Sec" />
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Target:{" "}
        {new Date(targetDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
