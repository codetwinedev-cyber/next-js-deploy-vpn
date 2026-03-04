// --- Request ---

export interface CreateCountdownRequest {
  title: string;
  description?: string | null;
  targetDateUtc: string; // ISO 8601, np. "2027-01-01T00:00:00Z"
  slug?: string | null; // 3-30 znaków: a-z A-Z 0-9 -
  email?: string | null;
}

// --- Responses ---

export interface CountdownCreatedResponse {
  id: string;
  slug: string;
  url: string;
}

export interface CountdownResponse {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  targetDateUtc: string;
  createdAtUtc: string;
  isActive: boolean;
}

export interface CountdownOgResponse {
  title: string;
  description: string | null;
  targetDateUtc: string;
  remainingSeconds: number;
}

export interface SlugAvailabilityResponse {
  slug: string;
  available: boolean;
}

// --- Errors (ProblemDetails RFC 9457) ---

export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
}

export interface ValidationProblemDetails extends ProblemDetails {
  errors: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  expired: boolean;
}
