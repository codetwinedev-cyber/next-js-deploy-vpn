"use client";

import { useEffect, useRef, useState } from "react";
import { checkSlugAvailabilityAction } from "@/lib/actions";

interface SlugAvailabilityState {
  status: "idle" | "checking" | "available" | "taken" | "error";
  message?: string;
}

export function useSlugAvailability(
  slug: string,
  debounceMs = 500,
): SlugAvailabilityState {
  const [state, setState] = useState<SlugAvailabilityState>({
    status: "idle",
  });
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const trimmed = slug.trim();
    if (!trimmed || trimmed.length < 3) {
      setState({ status: "idle" });
      return;
    }

    setState({ status: "checking" });

    timerRef.current = setTimeout(async () => {
      const result = await checkSlugAvailabilityAction(trimmed);
      if (result.success) {
        setState({
          status: result.data.available ? "available" : "taken",
          message: result.data.available
            ? "Slug is available"
            : "Slug is already taken",
        });
      } else {
        const isUnavailable = result.error?.includes("Cannot verify") ?? false;
        setState({
          status: isUnavailable ? "available" : "error",
          message: isUnavailable
            ? "Cannot verify (API unavailable) — will be checked on submit"
            : result.error,
        });
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [slug, debounceMs]);

  return state;
}
