import { env } from "../config/env";
import { getAuthToken } from "../store/authStore";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const url = `${env.apiUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getAuthToken();
    if (token) reqHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...rest, headers: reqHeaders });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status);
  }

  return data as T;
}
