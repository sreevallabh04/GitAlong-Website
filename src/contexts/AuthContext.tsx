import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface GitHubUserData {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  email: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

interface AuthContextType {
  currentUser: User | null;
  githubUserData: GitHubUserData | null;
  githubAccessToken: string | null;
  loading: boolean;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  githubUserData: null,
  githubAccessToken: null,
  loading: true,
  loginWithGitHub: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [githubUserData, setGithubUserData] = useState<GitHubUserData | null>(null);
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSession = (session: Session | null) => {
    const user = session?.user ?? null;
    setCurrentUser(user);

    if (user && session?.provider_token) {
      setGithubAccessToken(session.provider_token);
      localStorage.setItem('github_access_token', session.provider_token);
      fetchGitHubData(session.provider_token, user);
    } else if (user) {
      const savedToken = localStorage.getItem('github_access_token');
      if (savedToken) setGithubAccessToken(savedToken);
      const metadata = user.user_metadata;
      if (metadata) {
        setGithubUserData({
          login: metadata.user_name || metadata.preferred_username || '',
          name: metadata.full_name || metadata.name || null,
          avatar_url: metadata.avatar_url || '',
          html_url: `https://github.com/${metadata.user_name || metadata.preferred_username || ''}`,
          email: user.email ?? null,
          bio: null,
          company: null,
          location: null,
          followers: 0,
          following: 0,
          public_repos: 0,
          created_at: ''
        });
      }
    } else {
      setGithubUserData(null);
      setGithubAccessToken(null);
      localStorage.removeItem('github_access_token');
    }
  };

  const fetchGitHubData = async (accessToken: string, user: User) => {
    try {
      const githubData = await fetchGitHubUserData(accessToken);

      if (!githubData.email) {
        const primaryEmail = await fetchGitHubPrimaryEmail(accessToken);
        if (primaryEmail) {
          githubData.email = primaryEmail;
        }
      }

      setGithubUserData(githubData);
      await syncUserWithDatabase(user, githubData);
    } catch (err) {
      console.error('Error fetching/syncing GitHub data:', err);
    }
  };

  const syncUserWithDatabase = async (user: User, githubData: GitHubUserData) => {
    if (!supabase) return;

    const userData = {
      id: user.id,
      username: githubData.login,
      email: user.email || githubData.email || '',
      name: githubData.name,
      bio: githubData.bio,
      avatar_url: githubData.avatar_url,
      location: githubData.location,
      company: githubData.company,
      github_url: githubData.html_url,
      followers: githubData.followers,
      following: githubData.following,
      public_repos: githubData.public_repos,
      last_active_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'id' });

    if (error) console.error('Error upserting user:', error);
  };

  const fetchGitHubUserData = async (accessToken: string): Promise<GitHubUserData> => {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub user data');
    }

    return response.json();
  };

  const fetchGitHubPrimaryEmail = async (accessToken: string): Promise<string | null> => {
    try {
      const resp = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      if (!resp.ok) return null;
      const emails: Array<{email: string; primary: boolean; verified: boolean}> = await resp.json();
      const primaryVerified = emails.find(e => e.primary && e.verified);
      return primaryVerified?.email ?? emails.find(e => e.verified)?.email ?? (emails[0]?.email ?? null);
    } catch (err) {
      console.warn('Error fetching GitHub primary email:', err);
      return null;
    }
  };

  const loginWithGitHub = async () => {
    if (!supabase) throw new Error('Authentication service is not configured. Please check your environment setup.');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: 'read:user user:email',
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;
  };

  const logout = async () => {
    if (!supabase) throw new Error('Authentication service is not configured.');
    await supabase.auth.signOut();
    setGithubUserData(null);
    setGithubAccessToken(null);
    localStorage.removeItem('github_access_token');
  };

  const updateUserProfile = async (displayName: string) => {
    if (!supabase) throw new Error('Authentication service is not configured.');
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName }
    });
    if (error) throw error;
  };

  const value = {
    currentUser,
    githubUserData,
    githubAccessToken,
    loading,
    loginWithGitHub,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
