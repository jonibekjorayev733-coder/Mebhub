/**
 * Authentication Service
 * Handles API calls to backend for login, register, and Google OAuth
 * 
 * Supports three environments:
 * 1. Local development: localhost:5173 → localhost:8000 (direct + proxy)
 * 2. Mobile/ngrok: ngrok-frontend → ngrok-backend (must configure VITE_API_BASE_URL)
 * 3. Production: domain → api.domain
 */

// Get API base URL - smart detection for different environments
function getAPIBaseURL(): string {
  const envURL = import.meta.env.VITE_API_BASE_URL;
  
  // If explicitly configured in .env, use it (for ngrok or production)
  if (envURL) {
    console.debug('[AuthService] Using configured API URL:', envURL);
    return envURL;
  }
  
  // For localhost development, use direct localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.debug('[AuthService] Using localhost API URL');
    return 'http://127.0.0.1:8000';
  }
  
  // For ngrok or other domains without explicit config, use same origin with /api prefix
  // This expects a reverse proxy or the backend to be on the same domain
  console.warn('[AuthService] Using same-origin API calls. If using ngrok, please set VITE_API_BASE_URL in .env');
  return '';
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
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  return response.json();
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
