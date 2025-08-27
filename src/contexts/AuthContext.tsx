import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';

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
  isFirebaseAvailable: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  githubUserData: null,
  loading: true,
  loginWithGitHub: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  isFirebaseAvailable: false
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
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(false);

  useEffect(() => {
    // Check if Firebase is available
    setIsFirebaseAvailable(!!auth);
    
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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

  const loginWithGitHub = async () => {
    if (!auth) throw new Error('Firebase is not available');
    const provider = new GithubAuthProvider();
    provider.addScope('read:user');
    provider.addScope('user:email');
    
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Get the GitHub access token
      const credential = GithubAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      
      if (accessToken) {
        // Fetch GitHub user data
        const githubData = await fetchGitHubUserData(accessToken);
        setGithubUserData(githubData);
        
        // Update Firebase user profile with GitHub data
        if (result.user) {
          await updateProfile(result.user, {
            displayName: githubData.name || githubData.login,
            photoURL: githubData.avatar_url,
          });
        }
      }
    } catch (error: any) {
      console.error('GitHub login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) throw new Error('Firebase is not available');
    await signOut(auth);
    setGithubUserData(null); // Clear GitHub data on logout
  };

  const updateUserProfile = async (displayName: string) => {
    if (!auth) throw new Error('Firebase is not available');
    if (currentUser) {
      await updateProfile(currentUser, { displayName });
    }
  };

  const value = {
    currentUser,
    githubUserData,
    loading,
    loginWithGitHub,
    logout,
    updateUserProfile,
    isFirebaseAvailable
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};