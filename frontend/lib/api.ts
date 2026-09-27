const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "passenger" | "driver";
  createdAt: string;
  tesla?: {
    id: string;
    plateOrName: string;
    capacity: number;
    isOnline: boolean;
  } | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export const authStorage = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("oi_tesla_token");
  },
  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("oi_tesla_token", token);
  },
  getUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("oi_tesla_user");
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: User): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("oi_tesla_user", JSON.stringify(user));
  },
  clear: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("oi_tesla_token");
    localStorage.removeItem("oi_tesla_user");
  },
};

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = authStorage.getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Request failed",
        errors: data.errors,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: "Network error: Unable to connect to server",
    };
  }
}
