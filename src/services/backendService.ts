/**
 * Client for the GitAlong FastAPI backend (deployed on Render).
 * All endpoints require a Supabase JWT passed as Bearer token.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
console.log('[backend] BACKEND_URL resolved to:', BACKEND_URL);

// ─── Response types (mirror backend Pydantic models) ─────────────────────────

export interface UserSummary {
  id: string;
  username: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  languages: string[];
  interests: string[];
  match_score: number | null;
}

export interface RecommendationResponse {
  user_id: string;
  recommendations: UserSummary[];
  total: number;
  algorithm: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  company: string | null;
  website_url: string | null;
  github_url: string | null;
  followers: number;
  following: number;
  public_repos: number;
  languages: string[];
  interests: string[];
  created_at: string;
  last_active_at: string | null;
}

export interface HealthResponse {
  status: string;
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

async function backendFetch<T>(
  path: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const method = options.method?.toUpperCase() ?? 'GET';
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${accessToken}`,
  };
  // Only set Content-Type for requests that have a body
  if (method !== 'GET' && method !== 'HEAD') {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers as Record<string, string> },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Backend API ${response.status}: ${errorBody}`);
  }

  return response.json();
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const backendService = {
  /**
   * Check if the backend is reachable and healthy.
   * Does not require authentication.
   */
  async isHealthy(): Promise<boolean> {
    console.log('[backend] isHealthy() → fetching', `${BACKEND_URL}/api/v1/health`);
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/health`, {
        signal: AbortSignal.timeout(5000),
      });
      console.log('[backend] isHealthy() → status', response.status);
      if (!response.ok) return false;
      const data: HealthResponse = await response.json();
      console.log('[backend] isHealthy() → data', data);
      return data.status === 'ok';
    } catch (err) {
      console.error('[backend] isHealthy() FAILED:', err);
      return false;
    }
  },

  /**
   * Get ML-powered developer recommendations for the authenticated user.
   * Returns user profiles ranked by compatibility score (0–100).
   */
  async getRecommendations(
    accessToken: string,
    limit = 20
  ): Promise<RecommendationResponse> {
    return backendFetch<RecommendationResponse>(
      `/api/v1/recommendations?limit=${limit}`,
      accessToken
    );
  },

  /**
   * Get the authenticated user's full profile from the backend DB.
   */
  async getMyProfile(accessToken: string): Promise<UserProfile> {
    return backendFetch<UserProfile>('/api/v1/users/me', accessToken);
  },

  /**
   * Get any user's public profile by their Supabase UUID.
   */
  async getUserProfile(
    accessToken: string,
    userId: string
  ): Promise<UserProfile> {
    return backendFetch<UserProfile>(`/api/v1/users/${userId}`, accessToken);
  },

  /**
   * Re-fetch the authenticated user's GitHub stats and update the DB.
   */
  async refreshGitHubStats(accessToken: string): Promise<{ status: string; stats: Record<string, unknown> }> {
    return backendFetch('/api/v1/users/me/refresh-github', accessToken, {
      method: 'POST',
    });
  },
};
