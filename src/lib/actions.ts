"use server";

import { ApiRequestError, apiServer } from "@/lib/api";
import type {
  CountdownCreatedResponse,
  CreateCountdownRequest,
  SlugAvailabilityResponse,
} from "@/lib/types";

export type CreateCountdownResult =
  | { success: true; data: CountdownCreatedResponse }
  | { success: false; error: string };

export type CheckSlugAvailabilityResult =
  | { success: true; data: SlugAvailabilityResponse }
  | { success: false; error: string };

export async function createCountdownAction(
  data: CreateCountdownRequest,
): Promise<CreateCountdownResult> {
  try {
    const result = await apiServer.createCountdown(data);
    return { success: true, data: result };
  } catch (err) {
    if (err instanceof ApiRequestError) {
      return { success: false, error: err.message };
    }
    return {
      success: false,
      error: "API is not yet connected. Redirecting to preview...",
    };
  }
}

export async function checkSlugAvailabilityAction(
  slug: string,
): Promise<CheckSlugAvailabilityResult> {
  try {
    const result = await apiServer.checkSlugAvailability(slug);
    return { success: true, data: result };
  } catch (err) {
    if (err instanceof ApiRequestError) {
      return { success: false, error: err.message };
    }
    return {
      success: false,
      error: "Cannot verify (API unavailable) — will be checked on submit",
    };
  }
}
