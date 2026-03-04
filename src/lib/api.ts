import type {
  CountdownCreatedResponse,
  CountdownOgResponse,
  CountdownResponse,
  CreateCountdownRequest,
  SlugAvailabilityResponse,
} from "./types";

/** Server-side only: direct backend URL. */
const SERVER_BASE_URL = process.env.API_BASE_URL ?? "";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}/api${path}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message =
        response.status === 429
          ? "Too many requests. Please wait a moment and try again."
          : (body?.detail ??
            body?.title ??
            `Request failed: ${response.status}`);
      throw new ApiRequestError(message, response.status, body?.errors);
    }

    return response.json() as Promise<T>;
  }

  async createCountdown(
    data: CreateCountdownRequest,
  ): Promise<CountdownCreatedResponse> {
    return this.request<CountdownCreatedResponse>("/countdowns", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCountdown(
    slug: string,
    options?: { next?: NextFetchRequestConfig },
  ): Promise<CountdownResponse> {
    return this.request<CountdownResponse>(`/countdowns/${slug}`, {
      next: options?.next,
    });
  }

  async getCountdownOg(
    slug: string,
    options?: { next?: NextFetchRequestConfig },
  ): Promise<CountdownOgResponse> {
    return this.request<CountdownOgResponse>(`/countdowns/${slug}/og`, {
      next: options?.next,
    });
  }

  async checkSlugAvailability(slug: string): Promise<SlugAvailabilityResponse> {
    return this.request<SlugAvailabilityResponse>(
      `/countdowns/slug-availability/${encodeURIComponent(slug)}`,
    );
  }

  async countdownExists(slug: string): Promise<boolean> {
    const response = await fetch(
      `${this.baseUrl}/api/countdowns/${encodeURIComponent(slug)}/exists`,
    );
    return response.ok;
  }

  async healthCheck(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response.text();
  }
}

export class ApiRequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/** Server-side API (calls backend directly). Use in Server Components and Server Actions. */
export const apiServer = new ApiClient(SERVER_BASE_URL);

export function createFallbackCountdown(slug: string): CountdownResponse {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    title: "Countdown not found",
    description: "The backend API is not yet connected.",
    targetDateUtc: new Date(Date.now() + 86400000).toISOString(),
    slug,
    createdAtUtc: new Date().toISOString(),
    isActive: true,
  };
}
