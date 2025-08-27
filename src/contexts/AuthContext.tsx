import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  getAdditionalUserInfo
} from 'firebase/auth';
import { auth } from '../lib/firebase';
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

  // Fetch primary, verified email if not present on /user
  const fetchGitHubPrimaryEmail = async (accessToken: string): Promise<string | null> => {
    try {
      const resp = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      if (!resp.ok) {
        console.warn('Failed to fetch GitHub emails:', resp.status);
        return null;
      }
      const emails: Array<{email: string; primary: boolean; verified: boolean}> = await resp.json();
      const primaryVerified = emails.find(e => e.primary && e.verified);
      if (primaryVerified) return primaryVerified.email;
      const anyVerified = emails.find(e => e.verified);
      return anyVerified ? anyVerified.email : (emails[0]?.email ?? null);
    } catch (err) {
      console.warn('Error fetching GitHub primary email:', err);
      return null;
    }
  };

  const loginWithGitHub = async () => {
    if (!auth) throw new Error('Firebase is not available');
    const provider = new GithubAuthProvider();
    provider.addScope('read:user');
    provider.addScope('user:email');
    
    try {
      const result = await signInWithPopup(auth, provider);

      // Determine if this is a new user (signup)
      const additional = getAdditionalUserInfo(result);
      const isNewUser = !!additional?.isNewUser;
      
      // Get the GitHub access token
      const credential = GithubAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      
      if (accessToken) {
        // Fetch GitHub user data
        const githubData = await fetchGitHubUserData(accessToken);

        // Ensure we have an email by checking /user/emails when missing
        if (!githubData.email) {
          const primaryEmail = await fetchGitHubPrimaryEmail(accessToken);
          if (primaryEmail) {
            githubData.email = primaryEmail;
          }
        }

        setGithubUserData(githubData);
        
        // Update Firebase user profile with GitHub data
        if (result.user) {
          await updateProfile(result.user, {
            displayName: githubData.name || githubData.login,
            photoURL: githubData.avatar_url,
          });
        }

        // Send welcome email only on first sign up
        if (isNewUser) {
          const recipientEmail = result.user?.email || githubData.email || '';
          if (recipientEmail) {
            await sendWelcomeEmailToUser(result.user!, githubData, recipientEmail);
          } else {
            console.warn('No email available to send welcome email (new user).');
          }
        }
      }
    } catch (error: any) {
      console.error('GitHub login error:', error);
      throw error;
    }
  };

  const sendWelcomeEmailToUser = async (user: User, githubData: GitHubUserData, recipientEmail: string) => {
    try {
      const emailData: WelcomeEmailData = {
        user_name: githubData.name || githubData.login,
        user_email: recipientEmail,
        github_username: githubData.login,
        signup_date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };

      // Try to send email via EmailJS first
      let emailSent = await sendWelcomeEmail(emailData);
      
      // If EmailJS fails, use fallback
      if (!emailSent) {
        emailSent = await sendWelcomeEmailFallback(emailData);
      }

      if (emailSent) {
        console.log('Welcome email sent successfully to:', emailData.user_email);
      } else {
        console.warn('Failed to send welcome email to:', emailData.user_email);
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error to avoid breaking the login flow
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