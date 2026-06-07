export const AUTH_KEY = "taskflow-demo-session";

export function hasMockSession() {
  return window.localStorage.getItem(AUTH_KEY) === "active";
}

export function createMockSession() {
  window.localStorage.setItem(AUTH_KEY, "active");
}

export function clearMockSession() {
  window.localStorage.removeItem(AUTH_KEY);
}
