/**
 * Authentication Service
 * Handles API calls to backend for login, register, and Google OAuth
 * 
 * IMPORTANT: For mobile/external access, set VITE_API_BASE_URL in .env
 */

// Get API base URL with fallback strategy
function getAPIBaseURL(): string {
  // 1. Check explicit environment variable first
  const envURL = import.meta.env.VITE_API_BASE_URL;
  if (envURL) {
    console.log('[AuthService] Using configured API URL:', envURL);
    return envURL;
  }
  
  // 2. For localhost development, use direct localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[AuthService] Using localhost API URL: http://127.0.0.1:8000');
    return 'http://127.0.0.1:8000';
  }
  
  // 3. For other domains (ngrok, production), try same-origin first
  // This requires a proxy or reverse proxy setup
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const apiURL = `${protocol}//${hostname}:8000`;
  console.warn('[AuthService] Attempting same-hostname API URL:', apiURL);
  console.warn('[AuthService] If this fails, configure VITE_API_BASE_URL in .env file');
  return apiURL;
}

const API_BASE_URL = getAPIBaseURL();

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
}

export interface GoogleLoginRequest {
  token: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    is_active: boolean;
    provider: "email" | "google";
    google_id: string | null;
    profile_picture: string | null;
    created_at: string;
    updated_at: string | null;
  };
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin?: boolean;
  provider: "email" | "google";
  google_id: string | null;
  profile_picture: string | null;
  avatar?: string | null;
  created_at: string;
  updated_at: string | null;
}

/**
 * Register a new user with email and password
 */
export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Registration failed");
  }

  return response.json();
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const loginURL = `${API_BASE_URL}/auth/login`;
  console.log('[AuthService] Login attempt:', {
    url: loginURL,
    email: credentials.email,
    apiBaseURL: API_BASE_URL
  });

  try {
    const response = await fetch(loginURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    console.log('[AuthService] Login response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      const errorMsg = error.detail || `Login failed (${response.status})`;
      console.error('[AuthService] Login error:', errorMsg);
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log('[AuthService] Login successful:', data.user.email);
    return data;
  } catch (error: any) {
    console.error('[AuthService] Login exception:', error.message);
    throw error;
  }
}

/**
 * Login with Google OAuth token
 */
export async function googleLogin(token: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Google login failed");
  }

  return response.json();
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get current user");
  }

  const user = await response.json();
  // Map profile_picture to avatar for consistency
  if (user.profile_picture && !user.avatar) {
    user.avatar = user.profile_picture;
  }
  return user;
}

/**
 * Update user profile
 */
export async function updateProfile(token: string, fullName: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ full_name: fullName }),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
}
