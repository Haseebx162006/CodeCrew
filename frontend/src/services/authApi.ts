/**
 * Auth API Service
 * Handles communication with the FastAPI Backend Authentication Endpoints.
 */

import { User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  githubUsername?: string;
  address?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface BackendUserOut {
  id: string;
  name: string;
  email: string;
  github_username?: string | null;
  address?: string | null;
  avatar_url?: string | null;
}

export interface AuthResponseData {
  access_token: string;
  token_type: string;
  user: BackendUserOut;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOKEN_KEY = 'auth_token';

/**
 * Transforms Backend UserOut schema to Frontend User type
 */
export function mapBackendUserToUser(data: BackendUserOut): User {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    address: data.address || '',
    githubConnected: Boolean(data.github_username),
    githubUsername: data.github_username || undefined,
    avatarUrl: data.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.id}`,
  };
}

/**
 * Helper to extract error message from FastAPI responses
 */
async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const errorData = await response.json();
    if (errorData.detail) {
      if (typeof errorData.detail === 'string') {
        return errorData.detail;
      }
      if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
        return errorData.detail.map((err: { msg?: string }) => err.msg || 'Validation error').join(', ');
      }
    }
    return `Server error (${response.status})`;
  } catch {
    return `Network or server error (${response.status}: ${response.statusText})`;
  }
}

export const authApi = {
  /**
   * Register a new user
   */
  async register(payload: RegisterPayload): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        password: payload.password || 'password123',
        github_username: payload.githubUsername?.trim() || null,
        address: payload.address?.trim() || null,
      }),
    });

    if (!response.ok) {
      const errorMsg = await extractErrorMessage(response);
      throw new Error(errorMsg);
    }

    const data: AuthResponseData = await response.json();
    if (data.access_token) {
      localStorage.setItem(TOKEN_KEY, data.access_token);
    }

    return {
      user: mapBackendUserToUser(data.user),
      token: data.access_token,
    };
  },

  /**
   * Log in an existing user
   */
  async login(payload: LoginPayload): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        password: payload.password || 'password123',
      }),
    });

    if (!response.ok) {
      const errorMsg = await extractErrorMessage(response);
      throw new Error(errorMsg);
    }

    const data: AuthResponseData = await response.json();
    if (data.access_token) {
      localStorage.setItem(TOKEN_KEY, data.access_token);
    }

    return {
      user: mapBackendUserToUser(data.user),
      token: data.access_token,
    };
  },

  /**
   * Fetch current authenticated user profile using saved JWT
   */
  async getMe(token?: string): Promise<User | null> {
    const jwtToken = token || localStorage.getItem(TOKEN_KEY);
    if (!jwtToken) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
        }
        return null;
      }

      const data: BackendUserOut = await response.json();
      return mapBackendUserToUser(data);
    } catch {
      return null;
    }
  },

  /**
   * Fetch GitHub OAuth authorization URL
   */
  async getGitHubAuthUrl(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/github/url`);
      if (response.ok) {
        const data = await response.json();
        if (data.url) return data.url;
      }
    } catch (e) {
      console.warn('Could not fetch GitHub OAuth URL from backend', e);
    }
    return `https://github.com/login/oauth/authorize?client_id=Iv23liWJfDgfra9E8euf&scope=read:user,user:email,repo`;
  },

  /**
   * Exchange GitHub OAuth code for JWT and user profile
   */
  async exchangeGitHubCode(code?: string, installationId?: number): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/github/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code || null,
        installation_id: installationId || null,
      }),
    });

    if (!response.ok) {
      const errorMsg = await extractErrorMessage(response);
      throw new Error(errorMsg);
    }

    const data: AuthResponseData = await response.json();
    if (data.access_token) {
      localStorage.setItem(TOKEN_KEY, data.access_token);
    }

    return {
      user: mapBackendUserToUser(data.user),
      token: data.access_token,
    };
  },

  /**
   * Clear session token
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Get current stored token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
};

