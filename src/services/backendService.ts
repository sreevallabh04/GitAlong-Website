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
  ml_like_prob?: number;
  ml_top_reasons?: string[];
  filter_preference_score?: number;
  score_breakdown?: Record<string, number>;
}

export interface RecommendationResponse {
  user_id: string;
  recommendations: UserSummary[];
  total: number;
  algorithm: string;
}

export interface RecommendationFilters {
  languages?: string[];
  interests?: string[];
  location?: string;
  min_followers?: number;
  min_public_repos?: number;
  active_within_days?: number;
  filter_mode?: 'soft' | 'strict';
}

export interface SwipeResponse {
  status: string;
  matched: boolean;
  match_id: string | null;
}

export interface SwipeHistoryItem {
  id: string;
  swiped_user_id: string;
  action: 'like' | 'dislike' | 'superLike';
  swiped_at: string;
}

export interface MatchUserSummary {
  id: string;
  username: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  languages: string[];
}

export interface MatchItem {
  id: string;
  other_user: MatchUserSummary;
  matched_at: string;
  last_message: string | null;
  last_message_at: string | null;
  is_read: boolean;
}

export interface MatchListResponse {
  matches: MatchItem[];
  count: number;
  next_cursor: string | null;
  has_more: boolean;
}

export interface RepoSwipeResponse {
  status: string;
}

export interface RepoSwipeHistoryItem {
  id: string;
  repo_id: number;
  action: 'save' | 'skip';
  repo_full_name: string;
  repo_name: string;
  repo_owner: string;
  repo_url: string;
  repo_description: string | null;
  repo_language: string | null;
  repo_stars: number;
  repo_forks: number;
  swiped_at: string;
}

export interface RecordRepoSwipePayload {
  repo_id: number;
  action: 'save' | 'skip';
  repo_full_name: string;
  repo_name: string;
  repo_owner: string;
  repo_url: string;
  repo_description?: string | null;
  repo_language?: string | null;
  repo_stars?: number;
  repo_forks?: number;
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
      // Use AbortController for broad browser compatibility (Safari-safe).
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 30000);
      const response = await fetch(`${BACKEND_URL}/api/v1/health`, {
        signal: controller.signal,
      });
      window.clearTimeout(timeout);
      console.log('[backend] isHealthy() → status', response.status);
      if (!response.ok) return false;
      const data: HealthResponse = await response.json();
      console.log('[backend] isHealthy() → data', data);
      return data.status === 'ok';
    } catch (err) {
      console.error('[backend] isHealthy() FAILED for URL', `${BACKEND_URL}/api/v1/health`, err);
      return false;
    }
  },

  /**
   * Get ML-powered developer recommendations for the authenticated user.
   * Returns user profiles ranked by compatibility score (0–100).
   */
  async getRecommendations(
    accessToken: string,
    limit = 20,
    filters: RecommendationFilters = {}
  ): Promise<RecommendationResponse> {
    const params = new URLSearchParams({ limit: String(limit) });
    for (const lang of filters.languages ?? []) {
      if (lang.trim()) params.append('languages', lang.trim());
    }
    for (const topic of filters.interests ?? []) {
      if (topic.trim()) params.append('interests', topic.trim());
    }
    if (filters.location?.trim()) params.set('location', filters.location.trim());
    if (typeof filters.min_followers === 'number') params.set('min_followers', String(filters.min_followers));
    if (typeof filters.min_public_repos === 'number') params.set('min_public_repos', String(filters.min_public_repos));
    if (typeof filters.active_within_days === 'number') params.set('active_within_days', String(filters.active_within_days));
    if (filters.filter_mode) params.set('filter_mode', filters.filter_mode);

    return backendFetch<RecommendationResponse>(
      `/api/v1/recommendations?${params.toString()}`,
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

  async recordSwipe(
    accessToken: string,
    swipedUserId: string,
    action: 'like' | 'dislike' | 'superLike' = 'like'
  ): Promise<SwipeResponse> {
    return backendFetch<SwipeResponse>('/api/v1/swipes', accessToken, {
      method: 'POST',
      body: JSON.stringify({
        swiped_user_id: swipedUserId,
        action,
      }),
    });
  },

  async getSwipeHistory(accessToken: string, limit = 50): Promise<SwipeHistoryItem[]> {
    return backendFetch<SwipeHistoryItem[]>(
      `/api/v1/swipes/history?limit=${limit}`,
      accessToken
    );
  },

  async getMatches(accessToken: string, limit = 50): Promise<MatchListResponse> {
    return backendFetch<MatchListResponse>(
      `/api/v1/matches?limit=${limit}`,
      accessToken
    );
  },

  async recordRepoSwipe(
    accessToken: string,
    payload: RecordRepoSwipePayload
  ): Promise<RepoSwipeResponse> {
    return backendFetch<RepoSwipeResponse>('/api/v1/repo-swipes', accessToken, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getRepoSwipeHistory(
    accessToken: string,
    limit = 200,
    action?: 'save' | 'skip'
  ): Promise<RepoSwipeHistoryItem[]> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (action) params.set('action', action);
    return backendFetch<RepoSwipeHistoryItem[]>(
      `/api/v1/repo-swipes/history?${params.toString()}`,
      accessToken
    );
  },
};
