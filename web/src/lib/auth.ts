export type StoredUser = {
  email: string;
  name?: string;
};

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function setStoredUser(user: StoredUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

export function getDisplayName(user: StoredUser | null): string {
  if (!user) return "Reader";
  if (user.name && user.name.trim()) {
    return user.name.trim().split(" ")[0]; // 👈 only first name
  }

  const emailPrefix = user.email.split("@")[0];
  return emailPrefix || "Reader";
}