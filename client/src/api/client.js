const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "cashcompass_token";
const USER_KEY = "cashcompass_user";

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    const rawUser = sessionStorage.getItem(USER_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

export const setAuthSession = ({ token, user }) => {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const updateStoredUser = (user) => {
  if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data?.message
        ? data.message
        : "Request failed. Please try again.";

    if (response.status === 401) {
      clearAuthSession();
    }

    throw new Error(message);
  }

  return data;
}
