import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { sendWelcomeEmail, sendWelcomeEmailFallback, WelcomeEmailData } from '../utils/emailService';

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
  loading: boolean;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  isSupabaseAvailable: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  githubUserData: null,
  loading: true,
  loginWithGitHub: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  isSupabaseAvailable: false
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
  const [loading, setLoading] = useState(true);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(false);

  useEffect(() => {
    setIsSupabaseAvailable(!!supabase);
    
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
      setLoading(false);
    });

    // Listen for auth changes
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
      // If we have a provider token, we can fetch GitHub data
      fetchGitHubData(session.provider_token, user);
    } else if (user) {
      // If no token (e.g. session persistence), we might still have saved data or fetch it if needed
      // For now, let's try to get metadata which often has some github info
      const metadata = user.user_metadata;
      if (metadata && metadata.display_name) {
        setGithubUserData({
          login: metadata.user_name || '',
          name: metadata.full_name || metadata.display_name || '',
          avatar_url: metadata.avatar_url || '',
          html_url: `https://github.com/${metadata.user_name}`,
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
    }
  };

  const fetchGitHubData = async (accessToken: string, user: User) => {
    try {
      const githubData = await fetchGitHubUserData(accessToken);
      
      // Ensure we have an email
      if (!githubData.email) {
        const primaryEmail = await fetchGitHubPrimaryEmail(accessToken);
        if (primaryEmail) {
          githubData.email = primaryEmail;
        }
      }

      setGithubUserData(githubData);
      
      // Sync with our database users table
      await syncUserWithDatabase(user, githubData);
      
      // Check if this is a first-time login
      const { data } = await supabase
        .from('users')
        .select('created_at')
        .eq('id', user.id)
        .single();
        
      if (data) {
        // ... maintain original logic if needed
      }
    } catch (err) {
      console.error('Error fetching/syncing GitHub data:', err);
    }
  };

  const syncUserWithDatabase = async (user: User, githubData: GitHubUserData) => {
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
    if (!supabase) throw new Error('Supabase is not available');
    
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
    if (!supabase) throw new Error('Supabase is not available');
    await supabase.auth.signOut();
    setGithubUserData(null);
  };

  const updateUserProfile = async (displayName: string) => {
    if (!supabase) throw new Error('Supabase is not available');
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName }
    });
    if (error) throw error;
  };

  const value = {
    currentUser,
    githubUserData,
    loading,
    loginWithGitHub,
    logout,
    updateUserProfile,
    isSupabaseAvailable
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
