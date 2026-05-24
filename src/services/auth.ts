import { apiFetch } from "./api";
import type { UserProfile } from "../store/authStore";

export async function login(email: string, password: string) {
  return apiFetch<{ token: string; user: UserProfile }>("/api/mobile/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    auth: false,
  });
}

export async function register(name: string, email: string, password: string) {
  return apiFetch<{ token: string; user: UserProfile }>("/api/mobile/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
    auth: false,
  });
}

export async function fetchMe() {
  return apiFetch<{ user: UserProfile }>("/api/mobile/auth/me");
}
